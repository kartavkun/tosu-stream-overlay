// connecting to websocket
import WebSocketManager from './js/socket.js';
const socket = new WebSocketManager('127.0.0.1:24050');


// cache values here to prevent constant updating
const cache = {
  h100: -1,
  h50: -1,
  h0: -1,
  hSB: -1,
  title: "",
  artist: "",
  difficulty: "",
  bpm: -1,
  cs: -1,
  ar: -1,
  od: -1,
  hp: -1,
  maxSR: -1,
  ppFC: -1,
  background: "",
};



// Smoouth numbers update
const h100 = new CountUp('h100', 0, 0, 0, .5, { useEasing: true, useGrouping: true, separator: " ", decimal: "." })
const h50 = new CountUp('h50', 0, 0, 0, .5, { useEasing: true, useGrouping: true, separator: " ", decimal: "." })
const h0 = new CountUp('h0', 0, 0, 0, .5, { useEasing: true, useGrouping: true, separator: " ", decimal: "." })
const hSB = new CountUp('hSB', 0, 0, 0, .5, { useEasing: true, useGrouping: true, separator: " ", decimal: "." })




// receive message update from websocket
socket.api_v2(({ play, folders, beatmap, directPath, performance, state, resultsScreen }) => {
  try {

    let pp = state.name === 'ResultScreen' ? resultsScreen.pp : play.pp;
    let hits = state.name === 'ResultScreen' ? resultsScreen.hits : play.hits;

    if (cache.h100 !== hits['100']) {
      cache.h100 = hits['100'];
      h100.update(hits['100']);
    }

    if (cache.h50 !== hits['50']) {
      cache.h50 = hits['50'];
      h50.update(hits['50']);
    }

    if (cache.h0 !== hits['0']) {
      cache.h0 = hits['0'];
      h0.update(hits['0']);
    }

    if (cache.hSB !== hits.sliderBreaks) {
      cache.hSB = hits.sliderBreaks;
      hSB.update(hits.sliderBreaks);
    }

    if (cache.pp !== Math.round(play.pp.current)) {
      cache.pp = pp.current;
      let value = Math.round(pp.current).toString();
      // Ограничиваем значение до 4 цифр
      if (value.length > 4) {
        value = value.slice(0, 4); // Обрезаем до 4 символов
      }
      document.getElementById('pp').innerHTML = value;
      //document.getElementById('pp').innerHTML = Math.round(play.pp.current);
    }
    
    if ((state.name === 'Play' || state.name === 'ResultScreen') && cache.ppFC !== pp.fc) {
      cache.ppFC = pp.fc;
      let value = Math.round(pp.fc).toString();
      // Ограничиваем значение до 4 цифр
      if (value.length > 4) {
        value = value.slice(0, 4); // Обрезаем до 4 символов
      }
      document.getElementById('ppMax').innerHTML = value;
      //document.getElementById('ppMax').innerHTML = Math.round(pp.fc).toString();
    } else if (cache.ppSS !== performance.accuracy[100]) {
      cache.ppSS = performance.accuracy[100];
      let value = Math.round(performance.accuracy[100]).toString();
      // Ограничиваем значение до 4 цифр
      if (value.length > 4) {
        value = value.slice(0, 4); // Обрезаем до 4 символов
      }
      document.getElementById('ppMax').innerHTML = value;
      //document.getElementById('ppMax').innerHTML = Math.round(performance.accuracy[100]).toString();
    }

    if (cache['menu.bm.path.full'] != directPath.beatmapBackground) {
      cache['menu.bm.path.full'] = directPath.beatmapBackground;

      const background_path = directPath.beatmapBackground.replace(folders.songs, '');

      const background = document.getElementById('bg');
      background.style.opacity = 0;

      setTimeout(() => {
        background.src = `http://127.0.0.1:24050/files/beatmap/${background_path}`;  
        background.style.opacity = 1;
      }, 210);

      const image = new Image();
      image.src = `http://127.0.0.1:24050/files/beatmap/${background_path}`;
      image.onerror = () => document.getElementById('bg').classList.add('active');
      image.onload = () => document.getElementById('bg').classList.remove('active');
    };

    if (cache.artist !== beatmap.artist) {
      cache.artist = beatmap.artist;
      document.getElementById('artist').innerHTML = `${beatmap.artist}`;
      //reset('artist-text');
      //checkAndAnimateScroll(document.querySelector('.ArtistSong'), document.getElementById('artist'), 0);
    }

    if (cache.title !== beatmap.title) {
      cache.title = beatmap.title;
      document.getElementById('title').innerHTML = `${beatmap.title}`;
    //  reset('title-text');
    //  checkAndAnimateScroll(document.querySelector('.ArtistSong'), document.getElementById('title'), 0);
    }

    if (cache.ar !== beatmap.stats.ar.converted) {
      cache.ar = beatmap.stats.ar.converted;
      document.getElementById('ar').innerHTML = `AR: ${cache.ar}`;
      //document.getElementById('ar').innerHTML = beatmap.stats.ar.converted;
    }

    if (cache.bpm !== beatmap.stats.bpm.common) {
      cache.bpm = beatmap.stats.bpm.common;
      document.getElementById('bpm').innerHTML = `BPM: ${cache.bpm}`;
      //document.getElementById('bpm').innerHTML = beatmap.stats.bpm.common;
    }

    if (cache.starrate !== beatmap.stats.stars.total) {
      cache.starrate = beatmap.stats.stars.total;
      document.getElementById('starrate').innerHTML = `${cache.starrate}*`;
      //document.getElementById('starrate').innerHTML = beatmap.stats.stars.total;
    }

    //if (mods) {
    //
    //}

  } catch (error) {
    console.log(error);
  };
});
