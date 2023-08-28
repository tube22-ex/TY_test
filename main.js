let tag = document.createElement('script');
tag.src = "https://www.youtube.com/iframe_api";
let firstScriptTag = document.getElementsByTagName('script')[0];
firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);


let firebaseConfig = {
    apiKey: "AIzaSyDT9B8tcW9ioUvh4gLmwxtqu7XhyPyv4gg",
    databaseURL: "https://typingube-default-rtdb.firebaseio.com/",
};
  
// Firebase初期化
const app02 = firebase.initializeApp(firebaseConfig,"app02");
const app02DB = app02.database();  


/*ここまでDB初期化*/
let player;
let index = 0;
let time_int = [];//timetag
let display_lyrics = [];//タイムタグだけ除いた歌詞
let kana_display_lyrics = [];
let lyrics_s = [];//加工済み歌詞
let index_pre = 0
let index_next = 0
let lyrics_text = document.getElementById('lyrics_text')
let next_lyrics_text = document.getElementById('next_lyrics_text')
let kana_lyrics_text_typed = document.getElementById('kana_lyrics_text_typed')
let kana_lyrics_text = document.getElementById('kana_lyrics_text')
let roma_typed = document.getElementById('roma_typed')
let roma_untyped = document.getElementById('roma_untyped')
let key = document.getElementById('key')
let progressBar = document.getElementById('progressBar')
let currentTime = 0
let f = true
let word


function video_set(YT_URL){
    player.cueVideoById(YT_URL)
    //リセット
    progressBar.value = 0
    index = 0;
    time_int = [];//timetag
    display_lyrics = [];//タイムタグだけ除いた歌詞
    kana_display_lyrics = [];
    lyrics_s = [];//加工済み歌詞
    index_pre = 0
    index_next = 0
    word = null;
    console.log("りせっっっっっっと")
    f = false
    next_lyrics_text.innerHTML = ""
    lyrics_text.innerText = ''
    kana_lyrics_text_typed.innerText = ''
    kana_lyrics_text.innerText = ''
    roma_typed.innerText = ''
    roma_untyped.innerText = ''
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
}





/*ここからDB読み取り*/


app02DB.ref().once("value")
  .then(function(snapshot) {
    // 取得したデータを処理する
    var data = snapshot.val();
    add_lrc_selection(data)
  })



  function img_clickEvent(e){
    let f_URL = e.target.getAttribute("name")

    app02DB.ref().child(f_URL).once('value')
.then(snapshot => {
if (snapshot.exists()) {
  // パスが存在する場合の処理
  DBdata = snapshot.val();
  lrc_set(DBdata)
} else {
  // パスが存在しない場合の処理
  alert(`DB内に${f_URL}のデータがありません。`);
  return
}
})


}



function add_lrc_selection(data){
    for(d in data){
        let url = data[d]["YT_URL"];
        let f_id = data[d]["f_id"]
        let thumbnail = `<img 
class="thumbnail"src="http://img.youtube.com/vi/${url}/mqdefault.jpg" name="${f_id}">`
        document.getElementById('lrc_select').insertAdjacentHTML("beforeend",thumbnail);
    }
    document.querySelectorAll("#lrc_select img").forEach((imgElm) => {
        imgElm.addEventListener('click', img_clickEvent);
      })
      
}


function lrc_set(DBdata){
    video_set(DBdata["YT_URL"])
    lyrics(DBdata["lrc_data"])
    kana_lyrics(DBdata["lrc_kana_data"])
}


/*ここまで読み取り*/



function onYouTubeIframeAPIReady() {

    player = new YT.Player('player', {
      width: '640', //幅
      height: '360',
      videoId: '',
      events: {
        'onReady': onPlayerReady
      }
    });
}
  //Youtube playerAPI

  const time = document.getElementById('time');
  //プレイヤー下テキスト


function time_display(){
    currentTime = player.getCurrentTime();
    time.textContent = currentTime
    lyrics_display()
}

function onPlayerReady(event) {
    const time_interval = setInterval(time_display,5)

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
    progress()
}


function progress(){
    prog = (currentTime - index_pre)/(index_next - index_pre)
    if(index == 0){
        prog = (currentTime - 0)/(index_next - 0)
    }
    if(isFinite(prog)){
    progressBar.value = prog
}

}


function hig(canji,kana){
word = new Word(canji, kana);
roma_typed.textContent = '';
kana_lyrics_text_typed.textContent = '';
roma_untyped.textContent = word.roman.untyped.toUpperCase();
kana_lyrics_text.textContent = word.kana.untyped.toUpperCase();
f = true
window.addEventListener("keydown", (event) => {
    event.preventDefault();
    // ミスしたらisMissがtrue、全て打ち終わったらisFinishがtrueになる。
const { isMiss, isFinish } = word.typed(event.key); 
if(isMiss == false && isFinish == false){
    roma_typed.textContent += event.key.toUpperCase();
    roma_typed.style.color = 'blue';
    kana_lyrics_text_typed.textContent = word.kana.typed;
    kana_lyrics_text_typed.style.color = 'blue';
    roma_untyped.textContent = word.roman.untyped.toUpperCase();
    kana_lyrics_text.textContent = word.kana.untyped
    while(kana_lyrics_text_typed.textContent.length >= 10){
        kana_lyrics_text_typed.textContent = kana_lyrics_text_typed.textContent.substring(1);
        }
    while(roma_typed.textContent.length >= 16){
        roma_typed.textContent = roma_typed.textContent.substring(1);
    }
    
}
set(isFinish)

})

}


function set(isFinish){
    if(isFinish == true){
        kana_lyrics_text_typed.textContent += kana_lyrics_text.textContent;
        roma_typed.textContent += roma_untyped.textContent;
        roma_untyped.textContent = '';
        kana_lyrics_text.textContent = '';
        roma_typed.style.color = 'green';
        kana_lyrics_text_typed.style.color = 'green';
        if(f){
            if(word.kana.all == '' && index_next - currentTime > 5){
                player.seekTo(index_next - 3);
                //3秒前に飛ばす
            }
            if(word.kana.all!= ''){
            key.play();
            }
            f = false
        }
    }
  }

