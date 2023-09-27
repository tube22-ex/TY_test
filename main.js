let tag = document.createElement('script');
tag.src = "https://www.youtube.com/iframe_api";
let firstScriptTag = document.getElementsByTagName('script')[0];
firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

sound.init();

let max_score = 200000;

let is_finish = false;
let data;
let player;
let index = 0;
let time_int = [];//timetag
let display_lyrics = [];//タイムタグだけ除いた歌詞
let kana_display_lyrics = [];
let lyrics_s = [];//加工済み歌詞
let index_pre = 0;
let index_next = 0;
let lyrics_text = document.getElementById('lyrics_text');
let next_lyrics_text = document.getElementById('next_lyrics_text');
let kana_lyrics_text_typed = document.getElementById('kana_lyrics_text_typed');
let kana_lyrics_text = document.getElementById('kana_lyrics_text');
let roma_typed = document.getElementById('roma_typed');
let roma_untyped = document.getElementById('roma_untyped');
let key = document.getElementById('key');
let progressBar = document.getElementById('progressBar');
let TimeprogressBar = document.getElementById('TimeprogressBar');
let content = document.getElementById('content');
let score_div = document.getElementById('score_div');
let miss_div = document.getElementById('miss_div');
let type_div = document.getElementById('type_div');
let line_div = document.getElementById('line_div');
let nocori_line_div = document.getElementById('nocori_line_div');
let possible_div = document.getElementById('possible_div');
let play_speed = document.getElementById('play_speed');
let typing_speed = document.getElementById('typing_speed');
let currentTime = 0;
let f = true;
let is_play = false;
let is_last = false;
let clear_color = 'green';
let type_color = '#2b67ff';
let time_interval;

let score = 0;
let score_char = 0;
let kana_length = 0;
let kana_type_count = 0;
let line_type_count = 0;
//スコア
let miss_count = 0;
let type_count = 0;
let line_count = 0;
let f10count = 3;
//カウント系
let is_build_keyevent = false;


let Shortcut_key = {"Escape" : "Escape","F10":"F10"};
let speedList =  [0.25, 0.5, 0.75, 1, 1.25, 1.5, 1.75, 2];
//ショートカット系

let startTime = 0;
//時間
function video_set(YT_URL){
    player.cueVideoById(YT_URL)
    is_build_keyevent = false;
    score_div.textContent = 0;
    is_finish = false;
    score = 0;
    score_char = 0;
    kana_length = 0;
    kana_type_count = 0;
    line_type_count = 0;
    miss_count = 0;
    type_count = 0;
    line_count = 0;
    time.textContent = 0;
    kana_length = 0;
    kana_type_count = 0;
    line_type_count = 0;
    possible_div.textContent = 0;
    nocori_line_div.textContent = 0;
    line_div.textContent = "0 / 0"
    progressBar.value = 0
    index = 0;
    time_int = [];//timetag
    display_lyrics = [];//タイムタグだけ除いた歌詞
    kana_display_lyrics = [];
    lyrics_s = [];//加工済み歌詞
    index_pre = 0
    index_next = 0
    currentTime = 0
    is_last = false;
    console.log("りせっっっっっっと")
    f = false
    next_lyrics_text.innerHTML = ""
    lyrics_text.innerText = ''
    kana_lyrics_text_typed.innerText = ''
    kana_lyrics_text.innerText = ''
    roma_typed.innerText = ''
    roma_untyped.innerText = ''
    clearInterval(time_interval)
}

function lyrics(lrc){
    kana_time_int = [];//timetag
    kana_display_lyrics = [];//タイムタグだけ除いた歌詞
    lyrics_array = lrc.split("\n")
    let is_TY = false
    for (i of lyrics_array){
        if(i == ''){
            continue
        }
        if(i.startsWith("@Ruby") || i.startsWith("@TimeRatio")){
            break
        }
        i = i.replace(/[\ufeff\r]/g,"");
        let time_tags = i.match(/\[\d{2}:\d{2}:\d{2}\]/g);
        if (time_tags) { // null チェック
            for(let time_tag of time_tags){
                let time_str = time_tag.slice(1,-1)
                time_int.push(time_str)
            }
        }
        let TY_time_tags = i.match(/\[\d{2}:\d{2}\.\d{2}\]/g);
        if (TY_time_tags) { // null チェック
            for(let time_tag of TY_time_tags){
                let time_str = time_tag.slice(1,-1)
                let parts = time_str.split(/[:.]/); 
                let results = parts.map(part => parseFloat(part)); 
                let time_res = (results[0]*60) + results[1] + (results[2]*0.01)
                time_int.push(time_res)
            }
            is_TY = true
        }
        let match_text = '';
        if(is_TY){
            match_text = /\[\d{2}:\d{2}\.\d{2}\]/g
            
        }else{
            match_text = /\[\d{2}:\d{2}:\d{2}\]/g
        }
        let lyrics_text = i.replace(match_text,"")
        display_lyrics.push(lyrics_text)
        lyrics_text = lyrics_text.replace(/['’‘]/g,"");
        lyrics_text = lyrics_text.replace(/&.*?;/g ,"");
        lyrics_text = lyrics_text.replace(/<rt>.*?<\/rt>/g,"");
        lyrics_text = lyrics_text.replace(/(<([^>]+)>)/gi, '');
        lyrics_text = lyrics_text.replace(/[^\u3040-\u309F\u30A0-\u30FF\u4E00-\u9FFFa-zA-Z\d\s]/g," ");
        lyrics_text = lyrics_text.replace(/['’‘]/g);
        lyrics_text = lyrics_text.replace(/[・]/g,"");
        lyrics_s.push(lyrics_text)
    }
    console.log(time_int)
    console.log(display_lyrics)
    console.log(lyrics_s)
}

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
        let time_tags = i.match(/\[\d{2}:\d{2}\.\d{2}\]/g);
        if (time_tags) { // TY チェック
            kana_is_TY = true
        }
        let match_text = '';
        if(kana_is_TY){
            match_text = /\[\d{2}:\d{2}\.\d{2}\]/g
        }else{
            match_text = /\[\d{2}:\d{2}:\d{2}\]/g
        }
        let lyrics_text = i.replace(match_text,"")
        kana_display_lyrics.push(lyrics_text)
    }
    console.log(kana_display_lyrics)
    
    let kana_len_count = 0;
    kana_display_lyrics.forEach((k)=>{
        kana_len_count += k.length;
    })
    kana_length = kana_len_count;
    calc_score(kana_len_count)
}


function calc_score(k){
    score_char = max_score/k;
}

/*ここからスプレッドシート読み取り*/

const request = new XMLHttpRequest();
request.open('GET', 'https://script.google.com/macros/s/AKfycbwmJ81ez1wrTdjRoGPc8FbDhh5UTYp8R5N9-zGGhKpW1rEf1dDpZw9NgZwPQ9IUrwGz/exec');
    request.responseType = 'json';
    request.onload = function () {
        data = this.response;
        add_lrc_selection(data)
    };
request.send();


function img_clickEvent(e){
    let f_id = e.target.getAttribute("name")
    lrc_set(f_id)
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


function lrc_set(id){
    video_set(data[id]["URL"])
    lyrics(data[id]["KASHI"])
    kana_lyrics(data[id]["YOMI"])
}


/*ここまで読み取り*/



function onYouTubeIframeAPIReady() {

    player = new YT.Player('player', {
        width: '640', //幅
        height: '360',
        videoId: '',
        playerVars: {
            controls: 0, // コントロールバーを非表示にする
            enablejsapi: 1,
            disablekb: 1,
        },
        events: {
            'onReady': onPlayerReady,
            'onStateChange': onPlayerStateChange,
        }
    });
}
//Youtube playerAPI

const time = document.getElementById('time');
//プレイヤー下テキスト


document.getElementById('playVolume').addEventListener('input',(e)=>{
    if(player){
        player.setVolume(e.target.value);
    }
})


function time_display(){
    currentTime = player.getCurrentTime();
    let display_time = Math.floor(currentTime*100)/100
    time.textContent = `${display_time.toFixed(2)} / ${player.getDuration()}`;
    lyrics_display()
}

function onPlayerReady(event) {
    time_interval = setInterval(time_display,5)
    player.setVolume(10)
}

function onPlayerStateChange(event) {

    if (event.data == YT.PlayerState.PLAYING) {
        is_play = true;
        time_interval = setInterval(time_display,5)
    } else if (event.data == YT.PlayerState.PAUSED) {
        is_play = false;
      clearInterval(time_interval)
    } 
  }
  

function lyrics_display(){
    if(currentTime <= index_pre){
        index = 0
    }
    if(currentTime >= time_int[index]){
        lyrics_text.innerHTML = display_lyrics[index]
        kana_lyrics_text.innerHTML = kana_display_lyrics[index]
        hig(display_lyrics[index],kana_display_lyrics[index])
        index_pre = time_int[index]
        index++
        index_next = time_int[index]
        if(display_lyrics[index]){
        next_lyrics_text.innerHTML = "next " + kana_display_lyrics[index];
        }else{
            next_lyrics_text.innerHTML = ""
        }
    }
    if(index == 0 && kana_display_lyrics[0]){
        next_lyrics_text.innerHTML = "next " + kana_display_lyrics[0];
    }
    
    progress()
}


function progress(){
    if(is_play){
        TimeprogressBar.value = currentTime/player.getDuration();
        prog = (currentTime - index_pre)/(index_next - index_pre)
        if(index == 0){
            prog = currentTime/time_int[0]
        }
        
        if(index == time_int.length){
            let = lastprog = (currentTime - index_pre)/(player.getDuration() - index_pre)
            progressBar.value = lastprog
            is_last = true;
        }else{
            progressBar.value = prog
        }
        let index_line_count = 0
        for(let i=0;i<index;i++){
            index_line_count += kana_display_lyrics[i].length;
        }
        let x = index_line_count - (kana_type_count + line_type_count);
        let possible = (max_score/kana_length)*(kana_length - x);
        possible_div.textContent = Math.floor(possible);

        let line_noco = kana_display_lyrics.length - (index+1);
        if(line_noco != -1){
            nocori_line_div.textContent = line_noco;
        }   
        score = (max_score/kana_length)*(kana_type_count + line_type_count);
        let display_score = Math.round(score)

        score_div.textContent = display_score;
        miss_div.textContent = miss_count;
        type_div.textContent = type_count;
        //表示系
        if(!is_finish){
        typing_speed.innerText = `${(Math.round((keygraph.key_done().length / (new Date().getTime() - startTime)*100000))/100).toFixed(2)}打/秒 - ${(Math.round((keygraph.key_done().length / (new Date().getTime() - startTime)*100000) * 60 )/100).toFixed(2)}打/分`
        }
    }
}

// これから打つキー、すでに打ったキーを表示、 ... は適宜変更してください。
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



function hig(canji,kana){//canji消すとバグる
    if(line_type_count){
        kana_type_count += line_type_count;
    }
    line_type_count = 0;
    is_finish = false;
    kana = kana.toLowerCase();
    keygraph.build(kana);
    startTime = new Date().getTime()

    disp();
    //行初期化
    if(!is_build_keyevent){
    document.body.addEventListener("keydown", keyEvent)
    is_build_keyevent = true;
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
            if(roma_untyped.innerText == '' && index_next - currentTime > 5 && e.code=='Space'){
                player.seekTo(index_next - 3);
                //3秒前に飛ばす
            }
            if(is_last && e.code=='Space'){
                player.seekTo(player.getDuration() - 3);
            }
        };
    }
}

