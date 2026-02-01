// OFF UI helpers (toast, loading, api)
window.OFFUI = (() => {
  function toast(msg){
    const t = document.getElementById("toast");
    if(!t){ alert(msg); return; }
    t.textContent = msg;
    t.classList.add("show");
    setTimeout(()=>t.classList.remove("show"), 1800);
  }

  function loading(on){
    const el = document.getElementById("loadingOverlay");
    if(el) el.style.display = on ? "flex" : "none";
  }

  function esc(s){
    return String(s??"").replace(/[&<>"']/g, m=>({ "&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;" }[m]));
  }
  function escJS(s){ return String(s??"").replace(/['\\]/g, "\\$&"); }

  async function api(API_URL, fn, payload){
    const controller = new AbortController();
    const timeout = setTimeout(()=>controller.abort(), 20000);
    try{
      const res = await fetch(API_URL, {
        method:"POST",
        cache:"no-store",
        body: JSON.stringify({ fn, payload }),
        signal: controller.signal
      });
      const text = await res.text();
      try { return JSON.parse(text); }
      catch { return { ok:false, error:"Resposta inválida: " + text.slice(0,160) }; }
    }catch(err){
      return { ok:false, error:(err.name==="AbortError" ? "Timeout (20s)" : String(err)) };
    }finally{
      clearTimeout(timeout);
    }
  }

  function bindOverlayClose(idOverlay){
    const ov = document.getElementById(idOverlay);
    if(!ov) return;
    ov.addEventListener("click", (e)=>{
      if(e.target.id === idOverlay) ov.style.display = "none";
    });
  }

  return { toast, loading, api, esc, escJS, bindOverlayClose };
})();
