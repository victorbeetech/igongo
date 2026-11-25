// A tiny script that runs before the page paints, so a saved dark theme or
// text size never flashes in light mode first.

/** The script text, placed in <head>. It mirrors applyPreferences. */
export const THEME_SCRIPT = `(function(){try{var p=JSON.parse(localStorage.getItem("igongo.preferences")||"{}");
var r=document.documentElement;if(p.theme==="light"||p.theme==="dark")r.setAttribute("data-theme",p.theme);
var s={compact:0.92,standard:1,comfortable:1.15,large:1.3,extraLarge:1.5}[p.textSize];if(s)r.style.setProperty("--text-scale",String(s));}catch(e){}})();`;
