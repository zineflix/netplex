// For Responsive Header
window.addEventListener("scroll", function () {
    let nav = document.querySelector("nav");
    if (window.scrollY > 50) {
        nav.classList.add("nav-solid"); // Solid color after scrolling down
    } else {
        nav.classList.remove("nav-solid"); // Transparent at the top
    }
});

// For sticky header when scrolling
    window.addEventListener("scroll", function () {
      let nav = document.querySelector("nav");
      if (window.scrollY > 50) {
        nav.classList.add("nav-solid"); // Add solid background when scrolled
      } else {
        nav.classList.remove("nav-solid"); // Remove solid background at top
      }
    });

    // Toggle menu visibility when menu button is clicked
document.getElementById("menu-btn").addEventListener("click", function() {
    document.getElementById("menu").classList.toggle("active");
});


// For Dropdown More Button Function Start
document.addEventListener("DOMContentLoaded", function () {
    const dropdown = document.querySelector(".dropdown");

    dropdown.addEventListener("click", function () {
        this.classList.toggle("active");
    });
});
// For Dropdown More Button Function End


// TV Live Streaming Start //
const channelData = {
            channels: [
                {
                    name: "ABS-CBN (DASH)",
                    type: "mpd",
                    url: "https://cdn-ue1-prod.tsv2.amagi.tv/linear/amg01006-abs-cbn-kapcha-dash-abscbnono/index.mpd",
                    keys: {
                        "bd17afb5dc9648a39be79ee3634dd4b8": "3ecf305d54a7729299b93a3d69c02ea5"
                    }
                },
                {
                    name: "Cinemo",
                    type: "m3u8",
                    url: "https://d1bail49udbz1k.cloudfront.net/out/v1/78e282e04f0944f3ad0aa1db7a1be645/index_3.m3u8"
                },
                {
                    name: "CINEMO TFC",
                    url: "https://d1bail49udbz1k.cloudfront.net/out/v1/3a895f368f4a467c9bca0962559efc19/index.mpd",
                    type: "mpd",
                    keys: {
                        "aa8aebe35ccc4541b7ce6292efcb1bfb": "aab1df109d22fc5d7e3ec121ddf24e5f"
                    }
                },
                {
                    name: "Viva Cinema",
                    url: "https://qp-pldt-live-grp-06-prod.akamaized.net/out/u/viva_sd.mpd",
                    type: "mpd",
                    keys: {
                        "07aa813bf2c147748046edd930f7736e": "3bd6688b8b44e96201e753224adfc8fb"
                    }
                },
                {
                    name: "A2Z",
                    type: "m3u8",
                    url: "https://qp-pldt-live-grp-02-prod.akamaized.net/out/u/tv5_5.m3u8"
                },
                {
                    name: "Animax Live",
                    url: "https://tglmp01.akamaized.net/out/v1/de55fad9216e4fe7ad8d2eed456ba1ec/manifest.mpd",
                    type: "mpd",
                    keys: {
                        "edf1a715de9748638dd2fad75a419af2": "2f5a3199b26e9b693ae881af7ff864cf"
                    }
                },
                {
                    name: "Bilyonaryo News Channel",
                    url: "https://qp-pldt-live-grp-12-prod.akamaized.net/out/u/bilyonaryoch.mpd",
                    type: "mpd",
                    keys: {
                        "227ffaf09bec4a889e0e0988704d52a2": "b2d0dce5c486891997c1c92ddaca2cd2"
                    }
                },
                {
                    name: "Buko",
                    url: "	https://qp-pldt-live-grp-14-prod.akamaized.net/out/u/cg_buko_sd.mpd",
                    type: "mpd",
                    keys: {
                        "d273c085f2ab4a248e7bfc375229007d": "7932354c3a84f7fc1b80efa6bcea0615"
                    }
                },
                {
                    name: "DreamWorks (Tagalized)",
                    url: "https://qp-pldt-live-grp-14-prod.akamaized.net/out/u/cg_dreamworktag.mpd",
                    type: "mpd",
                    keys: {
                        "564b3b1c781043c19242c66e348699c5": "d3ad27d7fe1f14fb1a2cd5688549fbab"
                    }
                },
                {
                    name: "Cartoon Network Live",
                    url: "https://a190aivottlinear-a.akamaihd.net/OTTB/iad-nitro/live/clients/dash/enc/ampfzrmpam/out/v1/e08f3866c80040f2bc494cb48ebc7bce/cenc.mpd",
                    type: "mpd",
                    keys: {
                        "7ef57f7f3e8cf0efe4f3d5772a7cbb35": "0ac6d617095fbe0ca7f4c9ae72fa5f51"
                    }
                },
                {
                    name: "IBC 13",
                    url: "https://qp-pldt-live-grp-13-prod.akamaized.net/out/u/ibc13_sd.mpd",
                    type: "mpd",
                    keys: {
                        "04e292bc99bd4ccba89e778651914254": "ff0a62bdf8920ce453fe680330b563a5"
                    }
                },
                {
                    name: "I Heart Asia",
                    type: "m3u8",
                    url: "https://tv.jomarhost.xyz/memfs/7a68dbe7-c91b-49b5-bd2f-1b0d16dd187c.m3u8"
                },
                {
                    name: "Knowledge Channel",
                    url: "https://qp-pldt-live-grp-13-prod.akamaized.net/out/u/dr_knowledgechannel.mpd",
                    type: "mpd",
                    keys: {
                        "0f856fa0412b11edb8780242ac120002": "783374273ef97ad3bc992c1d63e091e7"
                    }
                },
                {
                    name: "Nick Jr",
                    url: "https://qp-pldt-live-grp-12-prod.akamaized.net/out/u/dr_nickjr.mpd",
                    type: "mpd",
                    keys: {
                        "bab5c11178b646749fbae87962bf5113": "0ac679aad3b9d619ac39ad634ec76bc8"
                    }
                },
                {
                    name: "Nickelodeon SD",
                    url: "https://qp-pldt-live-grp-11-prod.akamaized.net/out/u/dr_nickelodeon.mpd",
                    type: "mpd",
                    keys: {
                        "9ce58f37576b416381b6514a809bfd8b": "f0fbb758cdeeaddfa3eae538856b4d72"
                    }
                },
                {
                    name: "One News HD",
                    url: "https://qp-pldt-live-grp-11-prod.akamaized.net/out/u/onenews_hd1.mpd",
                    type: "mpd",
                    keys: {
                        "d39eb201ae494a0b98583df4d110e8dd": "6797066880d344422abd3f5eda41f45f"
                    }
                },
                {
                    name: "One PH",
                    url: "https://qp-pldt-live-grp-10-prod.akamaized.net/out/u/oneph_sd.mpd",
                    type: "mpd",
                    keys: {
                        "92834ab4a7e1499b90886c5d49220e46": "a7108d9a6cfcc1b7939eb111daf09ab3"
                    }
                },
                {
                    name: "One Sports HD",
                    url: "https://qp-pldt-live-grp-10-prod.akamaized.net/out/u/cg_onesports_hd.mpd",
                    type: "mpd",
                    keys: {
                        "53c3bf2eba574f639aa21f2d4409ff11": "3de28411cf08a64ea935b9578f6d0edd"
                    }
                },
                {
                    name: "One Sports+",
                    url: "https://qp-pldt-live-grp-10-prod.akamaized.net/out/u/cg_onesportsplus_hd1.mpd",
                    type: "mpd",
                    keys: {
                        "322d06e9326f4753a7ec0908030c13d8": "1e3e0ca32d421fbfec86feced0efefda"
                    }
                },
                {
                    name: "PBA Rush HD",
                    url: "https://qp-pldt-live-grp-10-prod.akamaized.net/out/u/cg_pbarush_hd1.mpd",
                    type: "mpd",
                    keys: {
                        "76dc29dd87a244aeab9e8b7c5da1e5f3": "95b2f2ffd4e14073620506213b62ac82"
                    }
                },
                {
                    name: "Pinoy Box Office",
                    url: "https://qp-pldt-live-grp-12-prod.akamaized.net/out/u/pbo_sd.mpd",
                    type: "mpd",
                    keys: {
                        "dcbdaaa6662d4188bdf97f9f0ca5e830": "31e752b441bd2972f2b98a4b1bc1c7a1"
                    }
                },
                {
                    name: "PTV 4",
                    url: "https://qp-pldt-live-grp-14-prod.akamaized.net/out/u/cg_ptv4_sd.mpd",
                    type: "mpd",
                    keys: {
                        "71a130a851b9484bb47141c8966fb4a3": "ad1f003b4f0b31b75ea4593844435600"
                    }
                },
                {
                    name: "RPTV",
                    url: "https://qp-pldt-live-grp-10-prod.akamaized.net/out/u/cnn_rptv_prod_hd.mpd",
                    type: "mpd",
                    keys: {
                        "1917f4caf2364e6d9b1507326a85ead6": "a1340a251a5aa63a9b0ea5d9d7f67595"
                    }
                },
                {
                    name: "Tap Sports",
                    url: "https://qp-pldt-live-grp-11-prod.akamaized.net/out/u/dr_tapsports.mpd",
                    type: "mpd",
                    keys: {
                        "eabd2d95c89e42f2b0b0b40ce4179ea0": "0e7e35a07e2c12822316c0dc4873903f"
                    }
                },
                {
                    name: "True FM TV",
                    url: "https://qp-pldt-live-grp-10-prod.akamaized.net/out/u/truefm_tv.mpd",
                    type: "mpd",
                    keys: {
                        "0559c95496d44fadb94105b9176c3579": "40d8bb2a46ffd03540e0c6210ece57ce"
                    }
                },
                {
                    name: "tvN Movies Pinoy",
                    url: "https://qp-pldt-live-grp-13-prod.akamaized.net/out/u/cg_tvnmovie.mpd",
                    type: "mpd",
                    keys: {
                        "2e53f8d8a5e94bca8f9a1e16ce67df33": "3471b2464b5c7b033a03bb8307d9fa35"
                    }
                },
                {
                    name: "UAAP Varsity Channel",
                    url: "https://qp-pldt-live-grp-10-prod.akamaized.net/out/u/cg_uaap_cplay_sd.mpd",
                    type: "mpd",
                    keys: {
                        "95588338ee37423e99358a6d431324b9": "6e0f50a12f36599a55073868f814e81e"
                    }
                },
                {
                    name: "HBO SIGNATURE",
                    url: "https://qp-pldt-live-grp-01-prod.akamaized.net/out/u/cg_hbosign.mpd",
                    type: "mpd",
                    keys: {
                        "a06ca6c275744151895762e0346380f5": "559da1b63eec77b5a942018f14d3f56f"
                    }
                },
                {
                    name: "BBC Lifestyle",
                    url: "https://qp-pldt-live-grp-09-prod.akamaized.net/out/u/cg_bbclifestyle.mpd",
                    type: "mpd",
                    keys: {
                        "34880f56627c11ee8c990242ac120002": "c23677c829bb244b79a3dc09ffd88ca0"
                    }
                },
                {
                    name: "Asianfoodnetwork.ph",
                    url: "https://qp-pldt-live-grp-07-prod.akamaized.net/out/u/asianfoodnetwork_sd.mpd",
                    type: "mpd",
                    keys: {
                        "1619db30b9ed42019abb760a0a3b5e7f": "5921e47fb290ae263291b851c0b4b6e4"
                    }
                },
                {
                    name: "GMA.Pinoy.TV.(East).(GMA).us",
                    url: "https://cdn-uw2-prod.tsv2.amagi.tv/linear/amg01006-abs-cbn-abscbn-gma-x7-dash-abscbnono/7c693236-e0c1-40a3-8bd0-bb25e43f5bfc/index.mpd",
                    type: "mpd",
                    keys: {
                        "c95ed4c44b0b4f7fa1c6ebbbbaab21a1": "47635b8e885e19f2ccbdff078c207058"
                    }
                },
                {
                    name: "Crime.Investigation.ph",
                    url: "https://qp-pldt-live-grp-12-prod.akamaized.net/out/u/dr_crime_invest.mpd",
                    type: "mpd",
                    keys: {
                        "21e2843b561c4248b8ea487986a16d33": "db6bb638ccdfc1ad1a3e98d728486801"
                    }
                },
                {
                    name: "Tagalized.Movie.Channel.ph",
                    url: "https://qp-pldt-live-grp-07-prod.akamaized.net/out/u/cg_tagalogmovie.mpd",
                    type: "mpd",
                    keys: {
                        "96701d297d1241e492d41c397631d857": "ca2931211c1a261f082a3a2c4fd9f91b"
                    }
                },
                {
                    name: "PBO.ph",
                    url: "https://qp-pldt-live-grp-04-prod.akamaized.net/out/u/pbo_sd.mpd",
                    type: "mpd",
                    keys: {
                        "dcbdaaa6662d4188bdf97f9f0ca5e830": "31e752b441bd2972f2b98a4b1bc1c7a1"
                    }
                },
                {
                    name: "TELERADYO.ph",
                    url: "https://cdn-ue1-prod.tsv2.amagi.tv/linear/amg01006-abs-cbn-teleradyo-dash-abscbnono/index.mpd",
                    type: "mpd",
                    keys: {
                        "47c093e0c9fd4f80839a0337da3dd876": "50547394045b3d047dc7d92f57b5fb33"
                    }
                },
                {
                    name: "The.Filipino.Channel.sg",
                    url: "https://cdn-ue1-prod.tsv2.amagi.tv/linear/amg01006-abs-cbn-tfcasia-dash-abscbnono/index.mpd",
                    type: "mpd",
                    keys: {
                        "9568cc84e1d944f38eac304517eab6fd": "f12142af8f39b3bab79d3679d3665ebe"
                    }
                },
                {
                    name: "TV5 HD (CIG)",
                    url: "https://qp-pldt-live-grp-02-prod.akamaized.net/out/u/tv5_hd.mpd",
                    type: "mpd",
                    keys: {
                        "2615129ef2c846a9bbd43a641c7303ef": "07c7f996b1734ea288641a68e1cfdc4d"
                    }
                },
                {
                    name: "PARAMOUNT NETWORK",
                    url: "https://qp-pldt-live-grp-11-prod.akamaized.net/out/u/dr_paramount.mpd",
                    type: "mpd",
                    keys: {
                        "0f853b34412b11edb8780242ac120002": "a7cc625eb0c7cf5f2a334f5e05e87fab"
                    }
                },
                {
                    name: "HBO FAMILY HD",
                    url: "https://qp-pldt-live-grp-03-prod.akamaized.net/out/u/cg_hbofam.mpd",
                    type: "mpd",
                    keys: {
                        "872910c843294319800d85f9a0940607": "f79fd895b79c590708cf5e8b5c6263be"
                    }
                },
                {
                    name: "SARI-SARI",
                    url: "https://qp-pldt-live-grp-06-prod.akamaized.net/out/u/cg_sari_sari_sd.mpd",
                    type: "mpd",
                    keys: {
                        "0a7ab3612f434335aa6e895016d8cd2d": "b21654621230ae21714a5cab52daeb9d"
                    }
                },
                {
                    name: "BUKO TV",
                    url: "https://qp-pldt-live-grp-06-prod.akamaized.net/out/u/cg_buko_sd.mpd",
                    type: "mpd",
                    keys: {
                        "d273c085f2ab4a248e7bfc375229007d": "7932354c3a84f7fc1b80efa6bcea0615"
                    }
                },
                {
                    name: "AXN CHANNEL (CIG)",
                    url: "https://qp-pldt-live-grp-06-prod.akamaized.net/out/u/cg_axn_sd.mpd",
                    type: "mpd",
                    keys: {
                        "fd5d928f5d974ca4983f6e9295dfe410": "3aaa001ddc142fedbb9d5557be43792f"
                    }
                },
                {
                    name: "NBA TV PH (CIG)",
                    url: "https://qp-pldt-live-grp-02-prod.akamaized.net/out/u/cgnl_nba.mpd",
                    type: "mpd",
                    keys: {
                        "c5e51f41ceac48709d0bdcd9c13a4d88": "20b91609967e472c27040716ef6a8b9a"
                    }
                },
                {
                    name: "Reserved Channel",
                    url: "mpd link",
                    type: "mpd",
                    keys: {
                        "key1": "value1"
                    }
                },
                {
                    name: "Reserved Channel",
                    type: "m3u8",
                    url: "m3u8 link"
                },
                {
                    name: "Reserved Channel",
                    url: "mpd link",
                    type: "mpd",
                    keys: {
                        "key1": "value1"
                    }
                },
                
            ],
            drm_servers: {
                "com.widevine.alpha": "https://your-license-server.com/widevine"
            }
        };

        let shakaPlayer, hls;
        const videoElement = document.getElementById('video');

        async function initPlayer() {
            shakaPlayer = new shaka.Player(videoElement);

            if (!shaka.Player.isBrowserSupported()) {
                console.error("Shaka Player is not supported in this browser.");
                return;
            }

            shakaPlayer.addEventListener('error', event => console.error("Shaka Error:", event));
            loadChannelList();
        }

        function loadChannelList() {
    const listContainer = document.getElementById('channel-buttons');
    listContainer.innerHTML = ""; // Clear previous items

    channelData.channels.forEach(channel => {
        const btn = document.createElement('button');
        btn.textContent = channel.name;
        btn.classList.add('channel-btn');
        btn.onclick = () => playStream(channel);
        listContainer.appendChild(btn);
    });
}

        function playStream(channel) {
    console.log("Playing:", channel.name, "Type:", channel.type);

    // Remove active class from all buttons
    document.querySelectorAll('.channel-btn').forEach(btn => btn.classList.remove('active'));

    // Find the clicked button and add 'active' class
    const buttons = document.querySelectorAll('.channel-btn');
    buttons.forEach(btn => {
        if (btn.textContent === channel.name) {
            btn.classList.add('active');
        }
    });

    // Switch stream
    if (channel.type === "mpd") {
        playMPD(channel.url, channel.keys, channelData.drm_servers);
    } else if (channel.type === "m3u8") {
        playM3U8(channel.url);
    }
}

function playM3U8(m3u8Url) {
    if (Hls.isSupported()) {
        if (hls) {
            hls.destroy(); // Destroy previous instance for faster switching
        }
        hls = new Hls();
        hls.loadSource(m3u8Url);
        hls.attachMedia(videoElement);
        hls.on(Hls.Events.MANIFEST_PARSED, () => {
            videoElement.play();
        });
    } else if (videoElement.canPlayType('application/vnd.apple.mpegurl')) {
        videoElement.src = m3u8Url;
        videoElement.play();
    } else {
        console.error("HLS not supported in this browser.");
    }
}


        async function playMPD(mpdUrl, keys, drmServers) {
            if (!shakaPlayer) return;
            
            try {
                shakaPlayer.configure({
                    drm: {
                        servers: drmServers,
                        clearKeys: keys
                    }
                });

                await shakaPlayer.load(mpdUrl);
                videoElement.play();
            } catch (error) {
                console.error("MPD Load Error:", error);
            }
        }

        function playM3U8(m3u8Url) {
            if (Hls.isSupported()) {
                if (hls) {
                    hls.destroy(); // Destroy previous instance
                }
                hls = new Hls();
                hls.loadSource(m3u8Url);
                hls.attachMedia(videoElement);
                hls.on(Hls.Events.MANIFEST_PARSED, () => {
                    videoElement.play();
                });
            } else if (videoElement.canPlayType('application/vnd.apple.mpegurl')) {
                videoElement.src = m3u8Url;
                videoElement.play();
            } else {
                console.error("HLS not supported in this browser.");
            }
        }

        document.addEventListener('DOMContentLoaded', initPlayer);
// TV Live Streaming End //


// Fullscreen Button Start //
document.addEventListener("DOMContentLoaded", function () {
    const video = document.getElementById("video");
    const fullscreenBtn = document.getElementById("fullscreen-btn");

    fullscreenBtn.addEventListener("click", function () {
        if (video.requestFullscreen) {
            video.requestFullscreen();
        } else if (video.mozRequestFullScreen) {
            video.mozRequestFullScreen();
        } else if (video.webkitRequestFullscreen) {
            video.webkitRequestFullscreen();
        } else if (video.msRequestFullscreen) {
            video.msRequestFullscreen();
        }

        // Force landscape mode on mobile
        if (screen.orientation && screen.orientation.lock) {
            screen.orientation.lock("landscape").catch((err) => console.error(err));
        }
    });
});
// Fullscreen Button End //
