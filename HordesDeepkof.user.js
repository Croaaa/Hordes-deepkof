// ==UserScript==
// @name         Hordes - deepkof
// @namespace    http://tampermonkey.net/
// @version      0.1
// @author       Killboy
// @match        http://www.hordes.fr/*
// @icon         https://www.zupimages.net/up/21/33/s0im.png
// @grant        none
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

    function deepkof() {
        var oldNode = document.getElementsByClassName(".tid_twinoidAvatar tid_default".slice(1));
        for(let a=0 ; a<oldNode.length ; a++) {
            var newNode = document.createElement('img');
            newNode.className = oldNode[a].className;
            newNode.src = "https://www.zupimages.net/up/21/33/s0im.png";
            newNode.style = "width:80px; height:80px; line-height:80px";
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
