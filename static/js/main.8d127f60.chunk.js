(this.webpackJsonpfrontend=this.webpackJsonpfrontend||[]).push([[0],{128:function(e,t,n){},129:function(e,t,n){},202:function(e,t,n){"use strict";n.r(t);var c=n(0),a=n.n(c),s=n(10),o=n.n(s),i=(n(128),n(82)),r=n(23),l=(n.p,n(129),n(38)),u=n.n(l),d=n(229),m=n(230),j=n(98),b=n(113),f=n.n(b),g=n(80),p=n.n(g),h=n(114),O=n.n(h),x=n(112),v=n.n(x),C=n(81),N=n.n(C),y=n(208),S=n(231),L=n(11),T=n(4),B=n(179);u.a.workerClass=n(198).default,u.a.accessToken="pk.eyJ1IjoiaG9sdGVyaHVzIiwiYSI6ImNrOWhkem96ZDB3Z2EzZ25hM3NhMXRuY2QifQ._wWey2Tkg64i1vzd1tUIoQ";var I=Object(d.a)((function(e){return{menuButton:{position:"absolute",left:0,top:0,margin:e.spacing(1)},menuIcon:{fill:"white"},modalCancelButton:{position:"absolute",right:0},modalCancelIcon:{fill:"black",width:"35px",height:"35px"},suggestButton:{position:"absolute",right:0,marginRight:e.spacing(1)},cardRoot:{width:"100%"},modalImageButtonLeft:{maxWidth:"10%"},moadlImageButtonRight:{maxWidth:"10%"}}})),k=function(e,t){var n='<div style="display: flex; flex-direction: column; align-items: center; justify-content: center; text-align: center;">';return n+="<strong>".concat(e,"</strong>"),n+=t?'<img src="'.concat(t,'" style="max-width: 30vmin; max-height: 25vmin;"/>'):"",n+="</div>"};function w(e){var t=e.replace(/^\(|\)$/g,"").split("),(");return t.forEach((function(e,t,n){n[t]=e.split(",").map(Number)})),t[0].reverse()}function M(e,t){return(e%t+t)%t}var F=function(e){var t=e.open,n=e.locations,a=e.mapRef,s=Object(c.useState)(""),o=Object(r.a)(s,2),i=o[0],l=o[1],d=Object(L.f)(),m=/[a-zA-Z]/g.test(i),j=n.filter((function(e){return!m||e.name.toLowerCase().includes(i.toLowerCase())}));return Object(c.useEffect)((function(){null!=a.current&&(n.forEach((function(e){a.current.setFeatureState({source:"locations",id:e.location_id},{filtered:!1})})),m&&j.forEach((function(e){a.current.setFeatureState({source:"locations",id:e.location_id},{filtered:!0})})))}),[i]),Object(T.jsxs)("div",{className:"sidebar "+(t?"open":"closed"),children:[Object(T.jsx)(v.a,{onChange:function(e){return l(e)},onCancelSearch:function(){return l("")},style:{width:"100%",borderRadius:0,borderBottom:"1px solid black",boxShadow:"none",backgroundColor:"#f5f5f5"}}),Object(T.jsx)("div",{className:"cards",id:"cards",children:j.map((function(e){return Object(T.jsxs)("div",{className:"cardBase",id:"location-"+e.location_id,onPointerDown:function(){return d.replace("/MTLsecrets/"+e.name)},children:[Object(T.jsx)("div",{className:"cardButtonContainer",children:Object(T.jsx)("div",{className:"cardButton"+(m?" filterUsed":""),onMouseEnter:function(){if(a.current){var t=e.coordinates,n=k(e.name,e.images[0]),c=new u.a.Popup({closeButton:!1,closeOnClick:!1});a.current.flyTo({center:t,esssential:!0,speed:.35}),a.current.fire("closeAllPopups"),c.setLngLat(t).setHTML(n).addTo(a.current),a.current.setFeatureState({source:"locations",id:e.location_id},{hover:!0}),a.current.on("closeAllPopups",(function(){c.remove()}))}},onMouseLeave:function(){a.current.fire("closeAllPopups"),a.current.setFeatureState({source:"locations",id:e.location_id},{hover:!1})}})}),Object(T.jsx)("div",{className:"cardTitle",children:e.name}),Object(T.jsx)("br",{}),Object(T.jsx)("div",{className:"cardDescription",children:e.description.slice(0,100)})]})}))})]})},z=a.a.memo(F);var E=function(){var e=I(),t=Object(L.f)(),n=Object(c.useState)(""),a=Object(r.a)(n,2),s=a[0],o=a[1],i=Object(c.useState)(""),l=Object(r.a)(i,2),u=l[0],d=l[1],b=Object(c.useState)(""),f=Object(r.a)(b,2),g=f[0],p=f[1];return Object(T.jsxs)("div",{className:"modal suggestionScreen",children:[Object(T.jsxs)("div",{className:"modalTitle",children:["Suggest Location",Object(T.jsx)(j.a,{className:e.modalCancelButton,onClick:function(){t.replace("/MTLsecrets")},children:Object(T.jsx)(N.a,{className:e.modalCancelIcon})})]}),Object(T.jsx)("div",{className:"suggestionTitle",children:Object(T.jsx)(S.a,{id:"suggestionTitle",onChange:function(e){return o(e.target.value)},label:"Location Title",variant:"outlined"})}),Object(T.jsx)("div",{className:"suggestionDescription",children:Object(T.jsx)(y.a,{id:"suggestionDescription",onChange:function(e){return d(e.target.value)},label:"Location Title",placeholder:"Location description"})}),Object(T.jsx)("div",{className:"suggestionDescription",children:Object(T.jsx)(S.a,{id:"suggestionCoordinates",label:"Coordinates",onChange:function(e){return p(e.target.value)},variant:"outlined"})}),Object(T.jsx)("div",{className:"suggestionDescription",children:Object(T.jsx)(m.a,{variant:"contained",size:"small",onClick:function(){return function(e,t,n){B.post("https://secretcities.xyz:3000/suggestion",{title:e,description:t,coordinates:n}).then((function(e){return alert(e)}))}(s,u,g)},children:"Submit"})})]})},R=function(e){var t=e.locations,n=I(),a=Object(L.f)(),s=Object(L.g)().locationName,o=t.map((function(e){return e.name})).indexOf(s),i=t[o],l=Object(c.useState)(0),u=Object(r.a)(l,2),d=u[0],m=u[1];return i?Object(T.jsxs)("div",{className:"modal",children:[Object(T.jsxs)("div",{className:"modalTitle",children:[i.name,Object(T.jsx)(j.a,{className:n.modalCancelButton,onClick:function(){a.replace("/MTLsecrets")},children:Object(T.jsx)(N.a,{className:n.modalCancelIcon})})]}),Object(T.jsxs)("div",{className:"modalImagesContainer",children:[i.images.length>1?Object(T.jsx)(j.a,{className:n.modalImageButtonLeft,onClick:function(){return m((function(e){return M(e-1,i.images.length||1)}))},children:Object(T.jsx)(p.a,{className:n.modalImageButtonIcon})}):null,Object(T.jsx)("img",{className:"modalImage",src:i.images[d]}),i.images.length>1?Object(T.jsx)(j.a,{className:n.modalImageButtonRight,onClick:function(){return m((function(e){return M(e+1,i.images.length||1)}))},children:Object(T.jsx)(O.a,{className:n.modalImageButtonIcon})}):null]}),Object(T.jsx)("div",{className:"modalDescriptionContainer",children:Object(T.jsx)("div",{className:"modalDescription",children:i.description})})]}):null},D=function(){var e=I(),t=Object(L.f)(),n=Object(c.useRef)(null),a=Object(c.useRef)(null),s=Object(c.useState)(-73.6573),o=Object(r.a)(s,2),l=o[0],d=o[1],b=Object(c.useState)(45.5017),g=Object(r.a)(b,2),h=g[0],O=g[1],x=Object(c.useState)(10),v=Object(r.a)(x,2),C=v[0],N=v[1],y=Object(c.useState)(!0),S=Object(r.a)(y,2),M=S[0],F=S[1],D=Object(c.useState)("mapbox://styles/mapbox/streets-v11"),P=Object(r.a)(D,2),_=P[0],A=P[1],Z=Object(c.useState)([]),H=Object(r.a)(Z,2),W=H[0],J=H[1];return Object(c.useEffect)((function(){B.get("https://secretcities.xyz:3000/locations").then((function(e){var t=e.data.map((function(e){return Object(i.a)(Object(i.a)({},e),{},{coordinates:w(e.coordinates)})}));J(t)}))}),[]),Object(c.useEffect)((function(){var e=new u.a.Map({container:n.current,style:_,center:[l,h],zoom:C});a.current=e,e.addControl(new u.a.NavigationControl,"top-right");var c=document.getElementsByClassName("mapboxgl-ctrl-top-right")[0].children[0],s=document.createElement("button");s.addEventListener("click",(function(){A("mapbox://styles/mapbox/streets-v11"===_?"mapbox://styles/mapbox/satellite-v9":"mapbox://styles/mapbox/streets-v11")})),s.innerHTML='<button class="mapboxgl-cntrl-style" type="button" title="Toggle Map Style" style="display: flex;justify-content: center;align-items: center;"><svg width="20" height="20" viewBox="0 0 24 24"><path d="M13.144 8.171c-.035-.066.342-.102.409-.102.074.009-.196.452-.409.102zm-2.152-3.072l.108-.031c.064.055-.072.095-.051.136.086.155.021.248.008.332-.014.085-.104.048-.149.093-.053.066.258.075.262.085.011.033-.375.089-.304.171.096.136.824-.195.708-.176.225-.113.029-.125-.097-.19-.043-.215-.079-.547-.213-.68l.088-.102c-.206-.299-.36.362-.36.362zm13.008 6.901c0 6.627-5.373 12-12 12-6.628 0-12-5.373-12-12s5.372-12 12-12c6.627 0 12 5.373 12 12zm-8.31-5.371c-.006-.146-.19-.284-.382-.031-.135.174-.111.439-.184.557-.104.175.567.339.567.174.025-.277.732-.063.87-.025.248.069.643-.226.211-.381-.355-.13-.542-.269-.574-.523 0 0 .188-.176.106-.166-.218.027-.614.786-.614.395zm6.296 5.371c0-1.035-.177-2.08-.357-2.632-.058-.174-.189-.312-.359-.378-.256-.1-1.337.597-1.5.254-.107-.229-.324.146-.572.008-.12-.066-.454-.515-.605-.46-.309.111.474.964.688 1.076.201-.152.852-.465.992-.038.268.804-.737 1.685-1.251 2.149-.768.694-.624-.449-1.147-.852-.275-.211-.272-.66-.55-.815-.124-.07-.693-.725-.688-.813l-.017.166c-.094.071-.294-.268-.315-.321 0 .295.48.765.639 1.001.271.405.416.995.748 1.326.178.178.858.914 1.035.898.193-.017.803-.458.911-.433.644.152-1.516 3.205-1.721 3.583-.169.317.138 1.101.113 1.476-.029.433-.37.573-.693.809-.346.253-.265.745-.556.925-.517.318-.889 1.353-1.623 1.348-.216-.001-1.14.36-1.261.007-.094-.256-.22-.45-.353-.703-.13-.248-.015-.505-.173-.724-.109-.152-.475-.497-.508-.677-.002-.155.117-.626.28-.708.229-.117.044-.458.016-.656-.048-.354-.267-.646-.53-.851-.389-.299-.188-.537-.097-.964 0-.204-.124-.472-.398-.392-.564.164-.393-.44-.804-.413-.296.021-.538.209-.813.292-.346.104-.7-.082-1.042-.125-1.407-.178-1.866-1.786-1.499-2.946.037-.19-.114-.542-.048-.689.158-.352.48-.747.762-1.014.158-.15.361-.112.547-.229.287-.181.291-.553.572-.781.4-.325.946-.318 1.468-.388.278-.037 1.336-.266 1.503-.06 0 .038.191.604-.019.572.433.023 1.05.749 1.461.579.211-.088.134-.736.567-.423.262.188 1.436.272 1.68.069.15-.124.234-.93.052-1.021.116.115-.611.124-.679.098-.12-.044-.232.114-.425.025.116.055-.646-.354-.218-.667-.179.131-.346-.037-.539.107-.133.108.062.18-.128.274-.302.153-.53-.525-.644-.602-.116-.076-1.014-.706-.77-.295l.789.785c-.039.025-.207-.286-.207-.059.053-.135.02.579-.104.347-.055-.089.09-.139.006-.268 0-.085-.228-.168-.272-.226-.125-.155-.457-.497-.637-.579-.05-.023-.764.087-.824.11-.07.098-.13.201-.179.311-.148.055-.287.126-.419.214l-.157.353c-.068.061-.765.291-.769.3.029-.075-.487-.171-.453-.321.038-.165.213-.68.168-.868-.048-.197 1.074.284 1.146-.235.029-.225.046-.487-.313-.525.068.008.695-.246.799-.36.146-.168.481-.442.724-.442.284 0 .223-.413.354-.615.131.053-.07.376.087.507-.01-.103.445.057.489.033.104-.054.684-.022.594-.294-.1-.277.051-.195.181-.253-.022.009.34-.619.402-.413-.043-.212-.421.074-.553.063-.305-.024-.176-.52-.061-.665.089-.115-.243-.256-.247-.036-.006.329-.312.627-.241 1.064.108.659-.735-.159-.809-.114-.28.17-.509-.214-.364-.444.148-.235.505-.224.652-.476.104-.178.225-.385.385-.52.535-.449.683-.09 1.216-.041.521.048.176.124.104.324-.069.19.286.258.409.099.07-.092.229-.323.298-.494.089-.222.901-.197.334-.536-.374-.223-2.004-.672-3.096-.672-.236 0-.401.263-.581.412-.356.295-1.268.874-1.775.698-.519-.179-1.63.66-1.808.666-.065.004.004-.634.358-.681-.153.023 1.247-.707 1.209-.859-.046-.18-2.799.822-2.676 1.023.059.092.299.092-.016.294-.18.109-.372.801-.541.801-.505.221-.537-.435-1.099.409l-.894.36c-1.328 1.411-2.247 3.198-2.58 5.183-.013.079.334.226.379.28.112.134.112.712.167.901.138.478.479.744.74 1.179.154.259.41.914.329 1.186.108-.178 1.07.815 1.246 1.022.414.487.733 1.077.061 1.559-.217.156.33 1.129.048 1.368l-.361.093c-.356.219-.195.756.021.982 1.818 1.901 4.38 3.087 7.22 3.087 5.517 0 9.989-4.472 9.989-9.989zm-11.507-6.357c.125-.055.293-.053.311-.22.015-.148.044-.046.08-.1.035-.053-.067-.138-.11-.146-.064-.014-.108.069-.149.104l-.072.019-.068.087.008.048-.087.106c-.085.084.002.139.087.102z"></path></svg></button>\'',c.insertBefore(s,c.firstChild),e.on("move",(function(){d(e.getCenter().lng.toFixed(4)),O(e.getCenter().lat.toFixed(4)),N(e.getZoom().toFixed(2))})),e.on("load",(function(){e.addSource("locations",{type:"geojson",data:{type:"FeatureCollection",features:W.map((function(e){return{type:"Feature",id:e.location_id,properties:{title:e.name,image:e.images[0]},geometry:{type:"Point",coordinates:e.coordinates}}}))}}),e.addLayer({id:"locations",type:"circle",source:"locations",paint:{"circle-color":["case",["boolean",["feature-state","hover"],!1],"#000",["boolean",["feature-state","filtered"],!1],"#ff00ff","#ff0000"],"circle-radius":10,"circle-stroke-width":2,"circle-stroke-color":"#000000"}})}));var o=new u.a.Popup({closeButton:!1,closeOnClick:!1}),i=null;return e.on("mousedown","locations",(function(e){t.push("MTLsecrets/"+e.features[0].properties.title)})),e.on("mousemove","locations",(function(t){e.getCanvas().style.cursor="pointer";for(var n=t.features[0].geometry.coordinates.slice(),c=k(t.features[0].properties.title,t.features[0].properties.image);Math.abs(t.lngLat.lng-n[0])>180;)n[0]+=t.lngLat.lng>n[0]?360:-360;a.current.fire("closeAllPopups"),o.setLngLat(n).setHTML(c).addTo(e),t.features.length>0&&(i&&e.setFeatureState({source:"locations",id:i},{hover:!1}),i=t.features[0].id,e.setFeatureState({source:"locations",id:i},{hover:!0}))})),e.on("mouseleave","locations",(function(){null!=i&&e.setFeatureState({source:"locations",id:i},{hover:!1}),i=null,e.getCanvas().style.cursor="",o.remove()})),function(){return e.remove()}}),[W,_]),Object(T.jsxs)(T.Fragment,{children:[Object(T.jsxs)("div",{className:"topbar",children:[Object(T.jsx)(j.a,{className:e.menuButton,onClick:function(){return F((function(e){return!e}))},children:M?Object(T.jsx)(p.a,{className:e.menuIcon}):Object(T.jsx)(f.a,{className:e.menuIcon})}),Object(T.jsx)("div",{className:"logo",children:"MTLSECRETS"}),Object(T.jsx)(m.a,{size:"small",variant:"contained",onClick:function(){return t.push("MTLsecrets/suggest")},className:e.suggestButton,children:"Suggest"})]}),Object(T.jsx)("div",{className:"topSpacer"}),Object(T.jsxs)("div",{className:"mainContent",children:[Object(T.jsx)(z,{open:M,locations:W,mapRef:a}),Object(T.jsxs)(L.c,{children:[Object(T.jsx)(L.a,{exact:!0,path:"/MTLsecrets/suggest",children:Object(T.jsx)(E,{})}),Object(T.jsx)(L.a,{path:"/MTLsecrets/:locationName",children:Object(T.jsx)(R,{locations:W})})]})]}),Object(T.jsx)("div",{ref:n,className:"map-container"})]})},P=function(e){e&&e instanceof Function&&n.e(3).then(n.bind(null,232)).then((function(t){var n=t.getCLS,c=t.getFID,a=t.getFCP,s=t.getLCP,o=t.getTTFB;n(e),c(e),a(e),s(e),o(e)}))},_=n(77);o.a.render(Object(T.jsx)(a.a.StrictMode,{children:Object(T.jsx)(_.a,{children:Object(T.jsx)(D,{})})}),document.getElementById("root")),P()}},[[202,1,2]]]);
//# sourceMappingURL=main.8d127f60.chunk.js.map