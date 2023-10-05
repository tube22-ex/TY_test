let tag = document.createElement('script');
tag.src = "https://www.youtube.com/iframe_api";
let firstScriptTag = document.getElementsByTagName('script')[0];
firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

sound.init();

let app01;
let app01DB;

(function() {
    const firebaseConfig = {
            apiKey: "AIzaSyCZulPboPP-zrKecvC4OCK6gbTJ_5u7o_8",
            databaseURL: "https://ty-project-58719-default-rtdb.firebaseio.com/",
    };
    const app01 = firebase.initializeApp(firebaseConfig);
    app01DB = app01.database();
})();

const max_score = 200000;
//maxスコア

const lyrics_text = document.getElementById('lyrics_text'),
     next_lyrics_text = document.getElementById('next_lyrics_text'),
     kana_lyrics_text_typed = document.getElementById('kana_lyrics_text_typed'),
     kana_lyrics_text = document.getElementById('kana_lyrics_text'),
     roma_typed = document.getElementById('roma_typed'),
     roma_untyped = document.getElementById('roma_untyped'),
     key = document.getElementById('key'),
     progressBar = document.getElementById('progressBar'),
     TimeprogressBar = document.getElementById('TimeprogressBar'),
     content = document.getElementById('content'),
     score_div = document.getElementById('score_div'),
     miss_div = document.getElementById('miss_div'),
     type_div = document.getElementById('type_div'),
     line_div = document.getElementById('line_div'),
     nocori_line_div = document.getElementById('nocori_line_div'),
     possible_div = document.getElementById('possible_div'),
     play_speed = document.getElementById('play_speed'),
     lrc_select = document.getElementById('lrc_select'),
     typing_speed = document.getElementById('typing_speed'),
     Result_div = document.getElementById('Result_div'),
     time = document.getElementById('time');
//要素系

const clear_color = 'green',
    type_color = '#2b67ff';
//色系

const Shortcut_key = {"Escape": "Escape","F4": "F4","F10": "F10"};
const speedList =  [0.25, 0.5, 0.75, 1, 1.25, 1.5, 1.75, 2];
//ショートカット系

let is_finish = false;
let f = true;
let is_play = false;
let is_last = false;
let is_build_keyevent = false;
let is_result = false;
let is_F4 = false;
let is_keyEvent = false;
//フラグ系

let data;
let player;
let time_interval;
let slow_interval;
//変数宣言

let time_int = [];//timetag
let display_lyrics = [];//タイムタグだけ除いた歌詞
let kana_display_lyrics = [];
let lyrics_s = [];//加工済み歌詞
//配列系

let index = 0;
let index_pre = 0;
let index_next = 0;
let currentTime = 0;
let play_id = 0;
let index_line_count = 0;
//index系

let score = 0;
let score_char = 0;
let kana_length = 0;
let kana_type_count = 0;
let line_type_count = 0;
//スコア系
let miss_count = 0;
let type_count = 0;
let line_count = 0;
let f10count = 3;
//カウント系

let intervalRate = 5;
let slow_interval_Rate = 100;
//時間


function reset(){
    // if(is_build_keyevent){
    //     document.body.removeEventListener("keydown", keyEvent)
    // }
    player.seekTo(0);
    Result_div.style.display = 'none';
    is_build_keyevent = false;
    is_finish = false;
    is_last = false;
    f = false;
    is_result = false;
    score_div.textContent = 0;
    time.textContent = 0;
    possible_div.textContent = 0;
    nocori_line_div.textContent = 0;
    line_div.textContent = "0 / 0";
    next_lyrics_text.innerHTML = "";
    lyrics_text.innerText = '';
    kana_lyrics_text_typed.innerText = '';
    kana_lyrics_text.innerText = '';
    roma_typed.innerText = '';
    roma_untyped.innerText = '';
    progressBar.value = 0;
    score = 0;
    score_char = 0;
    kana_type_count = 0;
    line_type_count = 0;
    miss_count = 0;
    type_count = 0;
    line_count = 0;
    kana_type_count = 0;
    line_type_count = 0;
    index = 0;
    index_pre = 0;
    index_next = 0;
    currentTime = 0;
    if(!is_F4){
    kana_length = 0;

    time_int = [];//timetag
    display_lyrics = [];//タイムタグだけ除いた歌詞
    kana_display_lyrics = [];
    lyrics_s = [];//加工済み歌詞
    };
    clearInterval(time_interval);
    clearInterval(slow_interval);
}
function video_set(YT_URL){
    player.cueVideoById(YT_URL);
    reset();
}
if(localStorage.getItem('name')){
    document.getElementsByName('ranking_show_name')[0].value = localStorage.getItem('name');
}

document.getElementsByName('ranking_show_name')[0].addEventListener('change',(e)=>{
    localStorage.setItem('name',e.target.value);
    alert(`${e.target.value}に設定しました。`)
})

function lyrics(lrc){
    kana_time_int = [];//timetag
    kana_display_lyrics = [];//タイムタグだけ除いた歌詞
    lyrics_array = lrc.split("\n")
    let is_TY = false
    for (i of lyrics_array){
        if(i == ''){
            continue;
        }
        if(i.startsWith("@Ruby") || i.startsWith("@TimeRatio")){
            break;
        }
        i = i.replace(/[\ufeff\r]/g,"");
        const time_tags = i.match(/\[\d{2}:\d{2}:\d{2}\]/g);
        if (time_tags) { // null チェック
            for(let time_tag of time_tags){
                time_int.push(time_tag.slice(1,-1));
            }
        }
        let TY_time_tags = i.match(/\[\d{2}:\d{2}\.\d{2}\]/g);
        if (TY_time_tags) { // null チェック
            for(let time_tag of TY_time_tags){
                const time_str = time_tag.slice(1,-1);
                const parts = time_str.split(/[:.]/); 
                const results = parts.map(part => parseFloat(part)); 
                const time_res = (results[0]*60) + results[1] + (results[2]*0.01)
                time_int.push(time_res)
            }
            is_TY = true;
        }
        let match_text = '';
        if(is_TY){
            match_text = /\[\d{2}:\d{2}\.\d{2}\]/g;
            
        }else{
            match_text = /\[\d{2}:\d{2}:\d{2}\]/g;
        }
        let lyrics_text = i.replace(match_text,"");
        display_lyrics.push(lyrics_text);
        lyrics_text = lyrics_text.replace(/['’‘]/g,"");
        lyrics_text = lyrics_text.replace(/&.*?;/g ,"");
        lyrics_text = lyrics_text.replace(/<rt>.*?<\/rt>/g,"");
        lyrics_text = lyrics_text.replace(/(<([^>]+)>)/gi, '');
        lyrics_text = lyrics_text.replace(/[^\u3040-\u309F\u30A0-\u30FF\u4E00-\u9FFFa-zA-Z\d\s]/g," ");
        lyrics_text = lyrics_text.replace(/['’‘]/g);
        lyrics_text = lyrics_text.replace(/[・]/g,"");
        lyrics_s.push(lyrics_text);
    };
};
//元の文

function kana_lyrics(kana_lrc){
    kana_display_lyrics = [];//タイムタグだけ除いた歌詞
    kana_lyrics_array = kana_lrc.split("\n")
    let kana_is_TY = false
    for (i of kana_lyrics_array){
        if(i == ''){
            continue
        }
        if(i.startsWith("@Ruby") || i.startsWith("@TimeRatio")){
            break
        }
        i = i.replace(/[\ufeff\r]/g,"");
        const time_tags = i.match(/\[\d{2}:\d{2}\.\d{2}\]/g);
        if (time_tags) { // TY チェック
            kana_is_TY = true
        }
        let match_text = '';
        if(kana_is_TY){
            match_text = /\[\d{2}:\d{2}\.\d{2}\]/g
        }else{
            match_text = /\[\d{2}:\d{2}:\d{2}\]/g
        }
        kana_display_lyrics.push(i.replace(match_text,""))
    }
    let kana_len_count = 0;
    kana_display_lyrics.forEach((k)=>{
        kana_len_count += k.length;
    })
    kana_length = kana_len_count;
    calc_score(kana_len_count)
}
//かな歌詞

function calc_score(k){
    score_char = max_score/k;
}

/*ここからスプレッドシート読み取り*/
(function() {
    const request = new XMLHttpRequest();
    request.open('GET', 'https://script.google.com/macros/s/AKfycbwmJ81ez1wrTdjRoGPc8FbDhh5UTYp8R5N9-zGGhKpW1rEf1dDpZw9NgZwPQ9IUrwGz/exec');
        request.responseType = 'json';
        request.onload = function () {
            data = this.response;
            add_lrc_selection(data)
        };
    request.send();
})();


function img_clickEvent(e){
    is_F4 = false;
    lrc_set(e.target.getAttribute("name"));
    play_id = e.target.getAttribute("name");
}

function add_lrc_selection(data){

    for(d in data){
        let url = data[d]["URL"];
        let f_id = d
        let thumbnail = `<img 
        class="thumbnail"src="http://img.youtube.com/vi/${url}/mqdefault.jpg" name="${f_id}">`
        document.getElementById('lrc_select').insertAdjacentHTML("beforeend",thumbnail);
    }
    document.querySelectorAll("#lrc_select img").forEach((imgElm) => {
        imgElm.addEventListener('click', img_clickEvent);
    })
      
}

function show_ranking(id){
    document.getElementById('ranking').innerHTML = `<ol type="1" id="ranking_ol"></ol>`
    app01DB.ref().child(id).once('value')
    .then(snapshot => {
        if (snapshot.exists()) {
        // パスが存在する場合の処理
        let DBdata = snapshot.val();
        DBdataSelector(DBdata)
        } else {
        // パスが存在しない場合の処理
        console.log(`DB内に${id}のデータがありません。`);
        return
        }
    })
    function DBdataSelector(dbdata){
        let rank_Array = [];
        for(item in dbdata){
            dbdata[item].sort((a, b) => b.score - a.score);
            rank_Array.push(dbdata[item][0]);
        }
        rank_Array.sort((a, b) => b.score - a.score);
        rank_Array.forEach((Array)=>{
            document.getElementById('ranking_ol').insertAdjacentHTML("beforeend",`<li>${Array["score"]}　${Array["NAME"]}</li>`);
        })

        document.querySelectorAll('#ranking_ol > li').forEach((list) => {
            list.addEventListener('click',show_record);
            }
        )
        function show_record(e){
            let li_text = e.target.textContent;
            let li_name = li_text.substring(li_text.indexOf("　") + 1,li_text.length);
            let select_object = dbdata[li_name];
            let window1 = window.open("about:blank", "window_name", "width=800,height=500,scrollbars=yes");
            window1.document.body.insertAdjacentHTML("afterbegin",`<ol id="Record_ol"></ol>`);
            select_object.forEach((s)=>{
                window1.document.getElementById('Record_ol').insertAdjacentHTML("afterbegin",`<li>${s["date"]} クリアライン数: ${s["line_count"]} スコア: ${s["score"]} タイプ数: ${s["type_count"]}</li>`)
            })
        }

    }

}


function lrc_set(id){
    video_set(data[id]["URL"]);
    lyrics(data[id]["KASHI"]);
    kana_lyrics(data[id]["YOMI"]);
    show_ranking(id);
    player.seekTo(0);
}
/*ここまで読み取り*/

function onYouTubeIframeAPIReady() {

    player = new YT.Player('player', {
        width: '640', //幅
        height: '360',
        videoId: '',
        playerVars: {
            start: 0,
            startSeconds: 0,
            controls: 0, // コントロールバーを非表示にする
            enablejsapi: 1,
            disablekb: 1,
            rel: 0,
            origin: location.protocol + '//' + location.hostname + "/"
        },
        events: {
            'onReady': onPlayerReady,
            'onStateChange': onPlayerStateChange,
        }
    });

}
//Youtube playerAPI



document.getElementById('playVolume').addEventListener('input',(e)=>{
    if(player){
        player.setVolume(e.target.value);
    }
})

document.getElementById('intervalRate_input').addEventListener('input',(e)=>{
    if(player){
        intervalRate = e.target.value;
    }
})

function time_display(){
    currentTime = player.getCurrentTime();
    lyrics_display()
}

function onPlayerReady() {
    time_interval = setInterval(time_display,intervalRate);
    slow_interval = setInterval(slow_interval_fuc,slow_interval_Rate);
    player.setVolume(10)
}

function onPlayerStateChange(event) {
    if (event.data == YT.PlayerState.PLAYING) {
        is_play = true;
        time_interval = setInterval(time_display,intervalRate);
        slow_interval = setInterval(slow_interval_fuc,slow_interval_Rate);
    } else if (event.data == YT.PlayerState.PAUSED) {
        is_play = false;
      clearInterval(time_interval);
      clearInterval(slow_interval);
    } else if(event.data == YT.PlayerState.ENDED) {
        Result();
      }
  }
  
function status_fuc(){
    if(is_play){
        let x = index_line_count - (kana_type_count + line_type_count);
        let possible = (max_score/kana_length)*(kana_length - x);
        possible_div.textContent = Math.floor(possible);
        let line_noco = kana_display_lyrics.length - (index+1);
        if(line_noco != -1){
            nocori_line_div.textContent = line_noco;
        }   
        score = (max_score/kana_length)*(kana_type_count + line_type_count);

        score_div.textContent = Math.round(score);
        miss_div.textContent = miss_count;
        type_div.textContent = type_count;
        //表示系
        if(!is_finish){
        typing_speed.innerText = `${(Math.round((keygraph.key_done().length / (currentTime - time_int[index - 1])*100))/100).toFixed(2)}打/秒 - ${(Math.round((keygraph.key_done().length / (currentTime - time_int[index - 1])*100) * 60 )/100).toFixed(2)}打/分`
        }
    }
}

function slow_interval_fuc(){
    let display_time = Math.floor(currentTime*100)/100
    time.textContent = `${display_time.toFixed(0)} / ${player.getDuration()}`;
    status_fuc();
}


function lyrics_display(){
    if(currentTime <= index_pre){
        index = 0
        keygraph.build('');
        disp();
        //行初期化
    }
    if(currentTime >= time_int[index]){
        lyrics_text.innerHTML = display_lyrics[index]
        //kana_lyrics_text.innerHTML = kana_display_lyrics[index]
        hig(kana_display_lyrics[index])
        index_pre = time_int[index]
        index++
        index_next = time_int[index]
        if(display_lyrics[index]){
        next_lyrics_text.innerHTML = "next " + kana_display_lyrics[index];
        }else{
            next_lyrics_text.innerHTML = ""
        }
    }
    if(index == 0 && kana_display_lyrics[0] !== 'undefined'){
        next_lyrics_text.innerHTML = "next " + kana_display_lyrics[0];
        document.onkeydown = function(e){
            e.preventDefault();
            if(e.code === 'Space' && index == 0 && kana_display_lyrics[0] !== 'undefined' && time_int[0] - currentTime > 3){
                player.seekTo(time_int[0] - 3);
            }
        }
    }
    
    progress()
}

function progress(){
    if(is_play){
        TimeprogressBar.value = currentTime/player.getDuration();
        prog = (currentTime - index_pre)/(index_next - index_pre)
        if(index == 0){
            prog = currentTime/time_int[0]
            keygraph.reset()
        }
        
        if(index == time_int.length){
            let = lastprog = (currentTime - index_pre)/(player.getDuration() - index_pre)
            progressBar.value = lastprog
            is_last = true;
        }else{
            progressBar.value = prog
        }
        index_line_count = 0
        for(let i=0;i<index;i++){
            index_line_count += kana_display_lyrics[i].length;
        }
    }
}


const disp = ()=>{
    // これからタイプしなければいけないキーの取得
    roma_untyped.innerText = keygraph.key_candidate();

    // タイプし終わったキーの取得
    roma_typed.innerText = keygraph.key_done();

    // これから打つ ひらがな の取得
    kana_lyrics_text.innerText = keygraph.seq_candidates();

    // 打ち終わった ひらがな の取得
    kana_lyrics_text_typed.innerText = keygraph.seq_done();
}

function hig(kana){
    if(line_type_count){
        kana_type_count += line_type_count;
    }
    line_type_count = 0;
    is_finish = false;
    kana = kana.toLowerCase();
    keygraph.build(kana);

    disp();
    //行初期化
    if(!is_keyEvent && !is_build_keyevent){
    document.body.addEventListener("keydown", keyEvent);
    is_build_keyevent = true;
    is_keyEvent = true;
    }
    function keyEvent(e) {
        e.preventDefault();
        if(e.code in Shortcut_key){
            switch (Shortcut_key[e.code]){
                case "Escape":
                    if (is_play) {
                        player.pauseVideo(); // 動画を一時停止
                    } else {
                        player.playVideo(); // 動画を再生
                    }
                    break;
                case "F10":
                    f10count+=1;
                    if(f10count == speedList.length){
                        f10count = 0;
                    }
                    player.setPlaybackRate(speedList[f10count]);
                    play_speed.textContent = `${speedList[f10count]}倍速`
                    break;
                case "F4":
                    is_F4 = true;
                    reset();
                default:
              }
              //ショートカットキー対応
        }else if(is_play){
            if (keygraph.next(e.key)) {
                roma_typed.style.color = type_color;
                kana_lyrics_text_typed.style.color = type_color;
                // 入力がタイピングするキーと一致している場合
                line_type_count = keygraph.seq_done().length;
                sound.play();
                type_count++
                disp();
            }

            // if(!keygraph.next(e.key)){
            //     miss_count ++;
            // }
            //ミス数だけおかしいので後回し

            if (keygraph.is_finished() && !is_finish) {
                roma_typed.style.color = clear_color;
                kana_lyrics_text_typed.style.color = clear_color;
                if(kana_lyrics_text_typed.innerText){
                    clear.play();
                    line_count++
                    line_div.textContent = `${line_count} / ${lyrics_s.length}`
                }
                // すべての文字をタイプし終わったとき
                is_finish = true;
                typing_speed.innerText = typing_speed.innerText;
            }

            while(kana_lyrics_text_typed.textContent.length >= 10){
                kana_lyrics_text_typed.textContent = kana_lyrics_text_typed.textContent.substring(1);
            }
            while(roma_typed.textContent.length >= 16){
                roma_typed.textContent = roma_typed.textContent.substring(1);
            }
            if(e.code == 'Space'){
                if(roma_untyped.innerText == '' && index_next - currentTime > 5 && index){
                    player.seekTo(index_next - 3);
                    //3秒前に飛ばす
                }
                if(keygraph.is_finished()){
                    if(!is_result && is_last && player.getDuration() - currentTime > 3){
                        player.seekTo(player.getDuration() - 3);
                    }else if(index_next - currentTime > 3){
                        player.seekTo(index_next - 3);
                    }
                }

        }
        };
    }
}

function Result(){
    is_result = true;
    Result_div.style.display = 'block';
    const now = new Date();
    let NOW = `${now.getFullYear()}/${now.getMonth() + 1}/${now.getDate()} ${now.getHours()}:${now.getMinutes()}`
    app01DB.ref(play_id).once('value').then(snapshot => {
        let name = localStorage.getItem('name')
        let appdata = snapshot.val()
        if(!appdata){
            let data = {};
            data[play_id] = {};
            data[play_id][name] = {};
            data[play_id][name][0] = {
                "score": Math.floor(score),
                "type_count": type_count,
                "line_count": line_count,
                "NAME": name,
                "date": NOW
            };
            app01DB.ref().update(data);
        }else{
            if(appdata[name]){
                let len = Object.keys(appdata[name]).length;
                let data01 = {};
                data01[len] = {
                    "score": Math.floor(score),
                    "type_count": type_count,
                    "line_count": line_count,
                    "NAME": name,
                    "date": NOW
                };
                app01DB.ref(play_id).child(name).update(data01);
            }else{
                let data02 = {};
                data02[name] = {};
                data02[name][0] = {
                    "score": Math.floor(score),
                    "type_count": type_count,
                    "line_count": line_count,
                    "NAME": name,
                    "date": NOW
                };
                app01DB.ref(play_id).update(data02);
            }
            //名前があるかどうか
        }
        //play_idがあるかどうか
    });
}
//Result表示
