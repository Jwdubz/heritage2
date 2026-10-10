(function(){
var d=document.documentElement,held=document.getElementById('held');
var shots=[].slice.call(document.querySelectorAll('.sh')),T=[0,1.6,3.2,4.8],LOOP=7.4,PAYOFF=4.8+0.25; /* hold payoff 2.6s; word lands 0.25s after the cut [B: rule] */
var paused=false,t0=performance.now(),acc=0,last=performance.now(),cur=0,shown=false;
function show(i){if(i===cur)return;shots[cur].classList.remove('on');void shots[i].offsetWidth;shots[i].classList.add('on');cur=i}
function loop(now){var dt=(now-last)/1000;last=now;if(!paused){acc=(acc+dt)%LOOP;var i=0;for(var k=0;k<T.length;k++)if(acc>=T[k])i=k;show(i);if(!shown&&acc>=PAYOFF){held.classList.add('on');shown=true}}requestAnimationFrame(loop)}
requestAnimationFrame(loop);
document.querySelectorAll('.reveal-words').forEach(function(el){
  (function walk(n){[].slice.call(n.childNodes).forEach(function(c){
    if(c.nodeType===3){var f=document.createDocumentFragment();c.textContent.split(/(\s+)/).forEach(function(t){if(!t)return;if(/^\s+$/.test(t))f.appendChild(document.createTextNode(t));else{var s=document.createElement('span');s.className='rw';s.textContent=t;f.appendChild(s)}});n.replaceChild(f,c)}
    else if(c.nodeType===1)walk(c)})})(el)});
var lenis=null;
if(window.Lenis){lenis=new Lenis({duration:1.1,easing:function(t){return Math.min(1,1.001-Math.pow(2,-10*t))}});function raf(t){if(!paused)lenis.raf(t);requestAnimationFrame(raf)}requestAnimationFrame(raf)}
if(window.gsap&&window.ScrollTrigger){gsap.registerPlugin(ScrollTrigger);if(lenis)lenis.on('scroll',ScrollTrigger.update);
  document.querySelectorAll('.reveal-words').forEach(function(el){var w=el.querySelectorAll('.rw');
    ScrollTrigger.create({trigger:el,start:'top 85%',end:'bottom 45%',onUpdate:function(s){var n=Math.ceil(s.progress*w.length*1.15);for(var i=0;i<w.length;i++)w[i].classList.toggle('on',i<n)},onLeave:function(){w.forEach(function(x){x.classList.add('on')})}})});
  var track=document.getElementById('track');
  gsap.to(track,{x:function(){return -(track.scrollWidth-innerWidth)},ease:'none',scrollTrigger:{trigger:'#run',start:'top top',end:function(){return '+='+(track.scrollWidth-innerWidth)},pin:true,scrub:true,invalidateOnRefresh:true}});
  addEventListener('load',function(){ScrollTrigger.refresh()});
}else{d.classList.remove('m')}
window.__ok=1;
var bar=document.querySelector('.bar');new IntersectionObserver(function(e){bar.classList.toggle('off',e[0].isIntersecting)},{threshold:.3}).observe(document.getElementById('visit'));
function all(){document.querySelectorAll('.rw').forEach(function(x){x.classList.add('on')});held.classList.add('on');shown=true}
addEventListener('scroll',function(){if(innerHeight+scrollY>=document.body.scrollHeight-40)all()},{passive:true});
var btn=document.getElementById('pause');
btn.addEventListener('click',function(){paused=!paused;btn.textContent=paused?'Play':'Pause';btn.setAttribute('aria-pressed',paused);
  if(paused){all();if(window.gsap)gsap.globalTimeline.pause();if(lenis)lenis.stop();d.classList.add('paused')}else{last=performance.now();if(window.gsap)gsap.globalTimeline.resume();if(lenis)lenis.start();d.classList.remove('paused')}});
function bez(t){var a=.7,b=.3;function x(u){return 3*a*u*(1-u)*(1-u)+3*b*u*u*(1-u)+u*u*u}function y(u){return 3*u*u*(1-u)+u*u*u}var lo=0,hi=1;for(var i=0;i<30;i++){var m=(lo+hi)/2;if(x(m)<t)lo=m;else hi=m}return y((lo+hi)/2)}
document.getElementById('totop').addEventListener('click',function(){if(lenis&&!paused){lenis.scrollTo(0,{duration:1.8,easing:bez})}else{var s=scrollY,t0=performance.now();(function st(n){var k=Math.min(1,(n-t0)/1800);scrollTo(0,s*(1-bez(k)));if(k<1)requestAnimationFrame(st)})(t0)}});
})();
