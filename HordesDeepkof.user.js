// ==UserScript==
// @name         Hordes - deepkof
// @description  A mort les nudistes.
// @namespace    http://tampermonkey.net/
// @version      0.5
// @author       Eliam
// @match        http://www.hordes.fr/*
// @icon         https://www.zupimages.net/up/21/33/s0im.png
// @grant        none
// @updateURL    https://github.com/Croaaa/HordesDeepkof/raw/main/HordesDeepkof.user.js
// @downloadURL  https://github.com/Croaaa/HordesDeepkof/raw/main/HordesDeepkof.user.js
// @require      https://tmp-staticserver.herokuapp.com/lib/KHLib-0.4.2.js
// ==/UserScript==

(function() {
    "use strict";

    const KhLib = window.KhLib.core.copy();
    KhLib.checkDependencies(KhLib, ["onGameUpdate", "dom"], "KhLib");
    const dom = KhLib.dom;

    const state = {
        initialized: false,
        forumInit: false,
    };

    function convertLetterToNumber(str) {
        var out = 0, len = str.length;
        for (let pos = 0; pos < len; pos++) {
            out += (str.charCodeAt(pos) - 96) * Math.pow(26, len - pos - 1);
        }
        return out;
    }

    function hsv2rgb(h,s,v)
    {
        let f= (n,k=(n+h/60)%6) => v - v*s*Math.max( Math.min(k,4-k,1), 0);
        return [Math.round(f(5)*255),Math.round(f(3)*255),Math.round(f(1)*255)];
    }

    function deepkof() {
        var oldNode = document.getElementsByClassName(".tid_twinoidAvatar tid_default".slice(1));
        for(let a=0 ; a<oldNode.length ; a++) {
            var newNode = document.createElement('img');
            let h = Math.round(360/26 * convertLetterToNumber(oldNode[a].textContent[0].toLowerCase())) + convertLetterToNumber(oldNode[a].textContent[1].toLowerCase());
            let rgb = hsv2rgb(h,0.6,0.8);

            // APPLY
            newNode.textContent = oldNode[a].textContent;
            newNode.className = oldNode[a].className;
            newNode.src = "https://www.zupimages.net/up/21/33/s0im.png";
            newNode.style = `width:80px; height:80px; line-height:80px; background-color:rgb(${rgb[0]},${rgb[1]},${rgb[2]})`;
            oldNode[a].parentNode.replaceChild(newNode, oldNode[a]);
        }
    }

    const refresh = () => {
        deepkof();
    };

    const tryBindToForum = () => {
        if (!state.forumInit && !state.forumIsLoading) {
            state.forumIsLoading = true;
            KhLib.onForumUpdate(deepkof)
                .then(() => {
                state.forumInit = true;
            })
                .catch(() => {
                state.forumIsLoading = false;
            });
        }
    };

    const load = () => {
        if (!state.initialized) {
            KhLib.onHashChange(tryBindToForum);
            KhLib.onGameUpdate(refresh);

            setTimeout(() => {
                tryBindToForum();
                deepkof();
            }, 2 * 1000);

            state.initialized = true;
            refresh();
        }
    };
    KhLib.ready(() => {
        load();
    });
})();
