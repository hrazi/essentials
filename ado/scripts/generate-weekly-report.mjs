#!/usr/bin/env node
/**
 * Developer Platform Weekly Report Generator
 * (Identical to the one in OKRv2 repo)
 * See inline docs for usage. Requires env ADO_PAT.
 */
import fs from 'node:fs';
import path from 'node:path';
import https from 'node:https';
import process from 'node:process';

const ORG = process.env.ADO_ORG || 'Skype';
const PROJECT = process.env.ADO_PROJECT || 'SPOOL';
const PAT = process.env.ADO_PAT;
const SAVED_QUERY_ID = process.env.ADO_QUERY_ID || 'e83a7058-c1e6-444a-b7ba-7f86e954aab6';

if (!PAT) {
  console.error('ERROR: Missing env ADO_PAT (Azure DevOps Personal Access Token).');
  process.exit(1);
}

const args = Object.fromEntries(
  process.argv.slice(2).map(a => {
    const [k, v = 'true'] = a.replace(/^--/, '').split('=');
    return [k, v];
  })
);

function parseDate(val) { if (!val) return null; const d = new Date(val); return isNaN(d) ? null : d; }
function getLastWeekRange() {
  const now = new Date();
  const todayUTC = Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate());
  const dow = new Date(todayUTC).getUTCDay(); // 0 Sun
  const daysSinceMonday = (dow + 6) % 7; // Mon->0
  const thisMonday = todayUTC - daysSinceMonday * 86400000;
  const lastMonday = thisMonday - 7 * 86400000;
  const lastSunday = lastMonday + 6 * 86400000;
  return { start: new Date(lastMonday), end: new Date(lastSunday) };
}

const overrideStart = parseDate(args.start);
const overrideEnd = parseDate(args.end);
const { start, end } = (overrideStart && overrideEnd) ? { start: overrideStart, end: overrideEnd } : getLastWeekRange();
function dateOnlyUTC(d) { return new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate())); }
const startUTC = dateOnlyUTC(start);
const endUTC = dateOnlyUTC(end);

const TARGET_AREA_PATHS = [
  'SPOOL\\Auth and Security',
  'SPOOL\\Shared\\Enterprise Promises',
  'SPOOL\\Resource Provider',
  'SPOOL\\Shared\\Push Notifications'
];
const TEAM_MAP = [
  { team: 'Auth', pattern: /^SPOOL\\Auth and Security/i, em: 'Anjul Garg' },
  { team: 'Enterprise Promises', pattern: /^SPOOL\\Shared\\Enterprise Promises/i, em: 'Anjul Garg' },
  { team: 'Resource Provider', pattern: /^SPOOL\\Resource Provider/i, em: 'Shahzaib Younis' },
  { team: 'Events / Notifications', pattern: /^SPOOL\\Shared\\Push Notifications/i, em: 'Shahzaib Younis' }
];
const BOARD_LINKS = {
  'Auth': 'https://skype.visualstudio.com/SPOOL/_backlogs/backlog/ACS%20Auth%20and%20Security/Features',
  'Enterprise Promises': 'https://skype.visualstudio.com/SPOOL/_backlogs/backlog/ACS%20Enterprise%20Promises/Features',
  'Resource Provider': 'https://skype.visualstudio.com/SPOOL/_backlogs/backlog/ACS%20Resource%20Provider/Features',
  'Events / Notifications': 'https://skype.visualstudio.com/SPOOL/_backlogs/backlog/ACS%20Push%20Notifications/Features'
};
const FIELDS = [
  'System.Id','System.Title','System.State','System.WorkItemType','System.AreaPath',
  'System.CreatedDate','Microsoft.VSTS.Common.ClosedDate','Microsoft.VSTS.Scheduling.StoryPoints','System.Tags'
];

async function adoRequest(method, urlPath, body, attempt=1) {
  const auth = Buffer.from(':' + PAT).toString('base64');
  return new Promise((resolve,reject)=>{
    const req = https.request({
      hostname:'dev.azure.com',
      path:`/${ORG}/${PROJECT}/${urlPath}`,
      method,
      headers:{
        Authorization:`Basic ${auth}`,
        'Content-Type':'application/json'
      }
    },res=>{
      let data=''; res.on('data',d=>data+=d);
      res.on('end',()=>{
        if(res.statusCode>=200 && res.statusCode<300){
          try { resolve(data?JSON.parse(data):{});} catch(e){reject(e);}
        } else if(res.statusCode===429 && attempt<4){
          const delay=500*attempt;
            setTimeout(()=>adoRequest(method,urlPath,body,attempt+1).then(resolve,reject),delay);
        } else {
          reject(new Error(`ADO ${method} ${urlPath} ${res.statusCode}: ${data}`));
        }
      });
    });
    req.on('error',reject);
    if(body) req.write(JSON.stringify(body));
    req.end();
  });
}

async function fetchSavedQueryIds(qid){
  const resp = await adoRequest('GET', `_apis/wit/wiql/${encodeURIComponent(qid)}?api-version=7.0`);
  return (resp.workItems||[]).map(w=>w.id);
}
async function fetchBatch(ids){
  if(!ids.length) return [];
  const resp = await adoRequest('POST','_apis/wit/workitemsbatch?api-version=7.0',{
    ids, fields: FIELDS, errorPolicy:'Omit'
  });
  return resp.value||[];
}
async function fetchAll(ids, chunk=180){
  const out=[];
  for(let i=0;i<ids.length;i+=chunk){
    out.push(...await fetchBatch(ids.slice(i,i+chunk)));
  }
  return out;
}

function inClosedWindow(closedDate){
  if(!closedDate) return false;
  const d = new Date(closedDate);
  const endIncl = new Date(endUTC.getTime()+86399999);
  return d>=startUTC && d<=endIncl;
}
function assignTeam(area){
  const t = TEAM_MAP.find(x=>x.pattern.test(area));
  return t? { team:t.team, em:t.em } : { team:'Other', em:'' };
}
function cycleDays(created, closed){
  if(!created||!closed) return null;
  return Math.round((new Date(closed)-new Date(created))/86400000);
}
function percentile(sorted,p){
  if(!sorted.length) return null;
  const idx=(sorted.length-1)*p, lo=Math.floor(idx), hi=Math.ceil(idx);
  if(lo===hi) return sorted[lo];
  return sorted[lo]+(sorted[hi]-sorted[lo])*(idx-lo);
}
function escapeHtml(s=''){return s.replace(/[&<>"']/g,c=>({ '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]||c));}
async function fetchWipSnapshot(){
  if(args.skipWip==='true') return [];
  const wiql = {
    query: `
      SELECT [System.Id]
      FROM WorkItems
      WHERE
        [System.TeamProject] = @project
        AND [System.AreaPath] IN (${TARGET_AREA_PATHS.map(p=>"'"+p.replace(/'/g,"''")+"'").join(',')})
        AND [System.State] NOT IN ('Closed','Done','Resolved','Removed')
        AND [System.CreatedDate] <= '${endUTC.toISOString().slice(0,10)}'
    `
  };
  const resp = await adoRequest('POST','_apis/wit/wiql?api-version=7.0',wiql);
  return (resp.workItems||[]).map(w=>w.id);
}
function formatDate(d){ return d.toISOString().slice(0,10); }

function renderHTML({perTeam, totals, cycleStats, wipSummary, generatedAt}) {
  function teamSection(name){
    const t=perTeam[name]; if(!t||!t.count) return '';
    const cards = t.items.map(it=>{
      const f=it.fields;
      const c=cycleDays(f['System.CreatedDate'], f['Microsoft.VSTS.Common.ClosedDate']);
      const tags=(f['System.Tags']||'').split(';').map(x=>x.trim()).filter(Boolean);
      const sp=f['Microsoft.VSTS.Scheduling.StoryPoints'];
      return `<div class="wi">
        <h4><a href="https://skype.visualstudio.com/SPOOL/_workitems/edit/${it.id}" target="_blank">[${it.id}] ${escapeHtml(f['System.Title'])}</a><span class="cycle">Cycle ${c??'—'}d</span></h4>
        <div class="tags">
          <span class="tag">${escapeHtml(f['System.WorkItemType'])}</span>
          ${sp?`<span class="tag">${sp} SP</span>`:''}
          ${tags.map(tg=>`<span class="tag">${escapeHtml(tg)}</span>`).join('')}
        </div>
      </div>`;
    }).join('');
    return `<div class="team-section" id="${name.toLowerCase().replace(/[^a-z0-9]+/g,'-')}">
      <div class="team-heading">
        <h3>${name}</h3>
        <span class="pill">Area: ${escapeHtml([...new Set(t.items.map(i=>i.fields['System.AreaPath']))].join(', '))}</span>
        <a class="pill" href="${BOARD_LINKS[name]}" target="_blank" rel="noopener">Backlog</a>
        <span class="pill">EM: ${escapeHtml(t.em)}</span>
      </div>
      <p class="small">Closed ${t.count} items.</p>
      <table><thead><tr><th>Metric</th><th>Value</th></tr></thead><tbody>
        <tr><td>Features</td><td>${t.typeCounts['Feature']||0}</td></tr>
        <tr><td>User Stories</td><td>${t.typeCounts['User Story']||0}</td></tr>
        <tr><td>Tasks</td><td>${t.typeCounts['Task']||0}</td></tr>
        <tr><td>Bugs</td><td>${t.typeCounts['Bug']||0}</td></tr>
        <tr><td>Story Points</td><td>${t.storyPoints}</td></tr>
        <tr><td>Avg / Median Cycle (d)</td><td>${t.cycleAvg} / ${t.cycleMedian}</td></tr>
      </tbody></table>
      <div class="wi-list">${cards}</div>
    </div>`;
  }
  const teamSections = Object.keys(perTeam).map(teamSection).join('');
  const wipTable = wipSummary.length
    ? `<section id="flow-health"><h2>Flow Health – WIP Age</h2>
       <table><thead><tr><th>Team</th><th>Active</th><th>Avg</th><th>P75</th><th>Oldest</th></tr></thead>
       <tbody>${wipSummary.map(r=>`<tr><td>${r.team}</td><td>${r.count}</td><td>${r.avg??'—'}</td><td>${r.p75??'—'}</td><td>${r.max??'—'}</td></tr>`).join('')}</tbody></table>
       <p class="small">Snapshot ages at report generation.</p></section>` : '';
  return `<!DOCTYPE html><html lang="en"><head>
<meta charset="UTF-8"/><title>Developer Platform Weekly Report (${formatDate(startUTC)} to ${formatDate(endUTC)})</title>
<meta name="viewport" content="width=device-width,initial-scale=1"/>
<style>
body{font-family:system-ui,-apple-system,Segoe UI,Roboto,sans-serif;margin:0;background:#f7f9fb;color:#222;}
header{padding:1.6rem 2rem 1rem;background:linear-gradient(140deg,#ffffff,#eef4fa 70%);border-bottom:1px solid #d9e2ec;}
h1{margin:0 0 .6rem;font-size:1.9rem;}
main{padding:1.2rem 2rem 3rem;max-width:1600px;margin:0 auto;}
h2{margin:2.2rem 0 1rem;border-bottom:1px solid #d9e2ec;padding-bottom:.45rem;font-size:1.2rem;}
.summary-box{background:#fff;border:1px solid #d9e2ec;border-radius:14px;padding:1.1rem 1.25rem;line-height:1.5;}
.kpi-grid{display:grid;gap:1rem;grid-template-columns:repeat(auto-fit,minmax(170px,1fr));margin:1.25rem 0 2rem;}
.kpi{background:#fff;border:1px solid #d9e2ec;border-radius:12px;padding:.8rem 1rem;}
.kpi h3{margin:.1rem 0 .25rem;font-size:.6rem;letter-spacing:.75px;text-transform:uppercase;color:#5b6472;}
.kpi .value{font-size:1.6rem;font-weight:600;}
table{width:100%;border-collapse:separate;border-spacing:0;margin:1rem 0 2rem;font-size:.8rem;background:#fff;border:1px solid #d9e2ec;border-radius:10px;overflow:hidden;}
th,td{padding:.55rem .65rem;border-bottom:1px solid #d9e2ec;text-align:left;vertical-align:top;}
th{background:#f1f5f9;font-size:.55rem;letter-spacing:.7px;text-transform:uppercase;color:#5b6472;}
tbody tr:nth-child(even){background:#f1f5f9;}
.pill{display:inline-block;padding:.3rem .6rem;border-radius:999px;background:#e4edf7;font-size:.5rem;letter-spacing:.5px;font-weight:600;color:#21527d;text-transform:uppercase;}
.team-section{margin-top:2.2rem;}
.team-heading{display:flex;flex-wrap:wrap;gap:.55rem;align-items:baseline;}
.wi-list{display:grid;gap:.5rem;margin:1rem 0 1.5rem;}
.wi{background:#fff;border:1px solid #d9e2ec;border-radius:10px;padding:.55rem .7rem;}
.wi h4{margin:0 0 .28rem;font-size:.72rem;}
.tags{display:flex;gap:.3rem;flex-wrap:wrap;}
.tag{background:#e9f0f7;padding:.18rem .45rem;font-size:.45rem;border-radius:10px;letter-spacing:.4px;font-weight:600;color:#2f4d63;}
.cycle{font-size:.45rem;color:#5b6472;margin-left:.4rem;}
.small{font-size:.6rem;color:#5b6472;}
footer{margin:3rem 0 2rem;font-size:.55rem;color:#5b6472;text-align:center;}
a{color:#0b62d6;text-decoration:none;}a:hover{text-decoration:underline;}
</style></head><body>
<header><h1>Developer Platform – Weekly Delivery Report</h1>
<div class="small">Week: ${startUTC.toDateString()} – ${endUTC.toDateString()}</div></header>
<main>
<section>
  <div class="summary-box">
    <h2 style="margin-top:0">Executive Summary</h2>
    <p>Closed <strong>${totals.total}</strong> items. Mix: Features ${totals.typePercents.Feature||0}% • User Stories ${totals.typePercents['User Story']||0}% • Tasks ${totals.typePercents.Task||0}% • Bugs ${totals.typePercents.Bug||0}%.</p>
    <ul style="margin:0 0 0 1.1rem;">
      <li><strong>Total Completed:</strong> ${totals.total}</li>
      <li><strong>Story Points:</strong> ${totals.storyPoints}</li>
      <li><strong>Avg / Median Cycle:</strong> ${cycleStats.avg}d / ${cycleStats.median}d (P75 ${cycleStats.p75}d)</li>
      <li><strong>Throughput / Day:</strong> ${(totals.total/7).toFixed(2)}</li>
    </ul>
  </div>
  <div class="kpi-grid">
    <div class="kpi"><h3>Total Completed</h3><div class="value">${totals.total}</div></div>
    <div class="kpi"><h3>User Stories</h3><div class="value">${totals.typeCounts['User Story']||0}</div></div>
    <div class="kpi"><h3>Bugs</h3><div class="value">${totals.typeCounts['Bug']||0}</div></div>
    <div class="kpi"><h3>Avg Cycle</h3><div class="value">${cycleStats.avg}</div></div>
    <div class="kpi"><h3>Median</h3><div class="value">${cycleStats.median}</div></div>
    <div class="kpi"><h3>Story Points</h3><div class="value">${totals.storyPoints}</div></div>
  </div>
</section>
<section id="team-breakdowns"><h2>Team Breakdowns</h2>${teamSections}</section>
${wipTable}
<section id="methodology"><h2>Methodology</h2>
<ul class="small">
<li>Window: ${formatDate(startUTC)} → ${formatDate(endUTC)} (UTC)</li>
<li>Filtered by ClosedDate in window & predefined Area Paths.</li>
<li>Cycle Time = ClosedDate − CreatedDate (calendar days).</li>
<li>Story Points from User Story field only.</li>
<li>WIP Age snapshot excludes Closed/Done/Resolved.</li>
<li>Source: Saved query ${SAVED_QUERY_ID} + workitemsbatch API.</li>
</ul>
</section>
</main>
<footer>Generated ${generatedAt} (UTC)</footer>
</body></html>`;
}

async function main(){
  console.log(`Generating weekly report for ${formatDate(startUTC)} to ${formatDate(endUTC)}`);
  const ids = await fetchSavedQueryIds(SAVED_QUERY_ID);
  console.log(`Saved query returned ${ids.length} IDs`);
  const details = await fetchAll(ids);
  console.log(`Fetched details for ${details.length} items`);

  const filtered = details.filter(it=>{
    const area = it.fields['System.AreaPath'];
    return TARGET_AREA_PATHS.some(p=>area.startsWith(p)) &&
      inClosedWindow(it.fields['Microsoft.VSTS.Common.ClosedDate']);
  });

  const perTeam = {};
  const globalTypeCounts = {};
  const cycleAll = [];
  let storyPointsTotal = 0;

  for(const it of filtered){
    const { team, em } = assignTeam(it.fields['System.AreaPath']);
    perTeam[team] ||= { em, items:[], typeCounts:{}, storyPoints:0, cycleTimes:[] };
    perTeam[team].items.push(it);
    const wt = it.fields['System.WorkItemType'];
    perTeam[team].typeCounts[wt] = (perTeam[team].typeCounts[wt]||0)+1;
    globalTypeCounts[wt] = (globalTypeCounts[wt]||0)+1;
    const sp = it.fields['Microsoft.VSTS.Scheduling.StoryPoints'];
    if(sp){ perTeam[team].storyPoints += sp; storyPointsTotal += sp; }
    const c = cycleDays(it.fields['System.CreatedDate'], it.fields['Microsoft.VSTS.Common.ClosedDate']);
    if(c!=null){ perTeam[team].cycleTimes.push(c); cycleAll.push(c); }
  }

  Object.values(perTeam).forEach(t=>{
    t.count = t.items.length;
    t.cycleTimes.sort((a,b)=>a-b);
    t.cycleAvg = t.cycleTimes.length ? Math.round(t.cycleTimes.reduce((a,b)=>a+b,0)/t.cycleTimes.length) : 0;
    t.cycleMedian = t.cycleTimes.length ? Math.round(percentile(t.cycleTimes,0.5)) : 0;
  });

  cycleAll.sort((a,b)=>a-b);
  const cycleStats = {
    avg: cycleAll.length ? Math.round(cycleAll.reduce((a,b)=>a+b,0)/cycleAll.length) : 0,
    median: cycleAll.length ? Math.round(percentile(cycleAll,0.5)) : 0,
    p75: cycleAll.length ? Math.round(percentile(cycleAll,0.75)) : 0
  };
  const total = filtered.length;
  const typePercents = {};
  for(const [k,v] of Object.entries(globalTypeCounts)){
    typePercents[k] = ((v/Math.max(1,total))*100).toFixed(0);
  }

  // WIP snapshot
  let wipSummary=[];
  try {
    const wipIds = await fetchWipSnapshot();
    if(wipIds.length){
      const wipDetails = await fetchAll(wipIds);
      const grouped={};
      for(const it of wipDetails){
        const { team } = assignTeam(it.fields['System.AreaPath']);
        grouped[team] ||= [];
        grouped[team].push(it);
      }
      wipSummary = Object.entries(grouped).map(([team, list])=>{
        const ages = list.map(i=>{
          const created = new Date(i.fields['System.CreatedDate']);
          return Math.round((endUTC - created)/86400000);
        }).filter(a=>a>=0).sort((a,b)=>a-b);
        return {
          team,
          count:list.length,
          avg:ages.length?Math.round(ages.reduce((a,b)=>a+b,0)/ages.length):null,
          p75:ages.length?Math.round(percentile(ages,0.75)):null,
          max:ages.length?ages[ages.length-1]:null
        };
      });
    }
  } catch(e){
    console.warn('WIP snapshot failed:', e.message);
  }

  const html = renderHTML({
    perTeam,
    totals: { total, storyPoints: storyPointsTotal, typeCounts: globalTypeCounts, typePercents },
    cycleStats,
    wipSummary,
    generatedAt: new Date().toISOString().replace('T',' ').replace(/\..*/,'')
  });

  const filename = `developer_platform_weekly_report_${formatDate(startUTC)}_to_${formatDate(endUTC)}.html`;
  fs.writeFileSync(path.join(process.cwd(), filename), html, 'utf8');
  console.log(`Wrote ${filename} (items=${total})`);
}

main().catch(e=>{ console.error(e); process.exit(1); });
