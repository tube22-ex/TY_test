const sound = {
	audio:[],
	index:0,
	init:()=>{
		for(let i=0;i<8;i++){
			sound.audio.push(new Audio(sound.data_uri));
		}
	},
	play:()=>{
		sound.audio[sound.index%sound.audio.length].play();
		sound.index += 1;
	},
	data_uri:"data:audio/mp3;base64,SUQzBAAAAAABAFRYWFgAAAASAAADbWFqb3JfYnJhbmQAbXA0MgBUWFhYAAAAEQAAA21pbm9yX3ZlcnNpb24AMABUWFhYAAAAHAAAA2NvbXBhdGlibGVfYnJhbmRzAG1wNDFpc29tAFRTU0UAAAAPAAADTGF2ZjU5LjI3LjEwMAAAAAAAAAAAAAAA//tUwAAAAAAAAAAAAAAAAAAAAAAASW5mbwAAAA8AAAAGAAAFQABJSUlJSUlJSUlJSUlJSUlJbW1tbW1tbW1tbW1tbW1tbW2SkpKSkpKSkpKSkpKSkpKStra2tra2tra2tra2tra2trbb29vb29vb29vb29vb29vb2/////////////////////8AAAAATGF2YzU5LjM3AAAAAAAAAAAAAAAAJAXcAAAAAAAABUAbuzFmAAAAAAAAAAAAAAAAAAAA//tUxAAAB9BNC7QxgAGOoe23EtACjAAABIAABAnELdzQDc4XT3dz4hf/ohUIjj/iCCGwo6UcGC7wQKOLg+UB9+Xfyf4gGggXHAgUONKODH/hj8EGBG5HGZFGYgwCQAEQCDaAAhgDM3aDEAFFqyk2ii3DmBNCcbIGkURLzMvGhrNJJoGiSHUhTOmyy4yqNrWZA0mB5avXt5MNTxgiyknQS0v/oczUuupb7beTigeMGABIqVJ/8PPJqhNbeWRTNMhA//tUxAQAClCPZfzxgAFWpmqw9Iw4BRiIcX86U6eBzPjKSkJTwVTBhawoYVquYUXAdXEkayhS2Uvh3/XM57Xfh8DuCaNp1z1DlmYBcHTuZaGirsKlSLlOSmN7taN9t2Jgns9mEgAHrgTEBQyAwIiAhXBhAEpjhGyjM4g2NsKWmZhGRlHcx7DWHmlTFceMrm7LssQu8ler9KN/rrpPOGV7ocIlncp3p0r6/wy/Zm/Vvu3B8OodENUEOFVkYzaIBBcP//tUxAUACrynUeYYbIFKDuq88w1gAAIhAXDc/A6ZO2LZkrKtEBhAmaQvdcyB4V2Ab1DXOh4D49k5nju2R0kiojehEetYhgKLiqS4pK6SwSHpJHUEHkDBfd951vwv2X2sKpDzcQqIpSAIMEEIeDSEnT6HIBDjpOVeTosYTkZ+ZqBKyk0FbnInWUCf0VzQiVGGz0ozDgWSKg4UmRo8maS2eel1Mc61q0rQf76x4Zn1PFosyFkKOJuHl3U0SAAVRWEi//tUxAYACtCrW+YIcIFLJK20kI57oNRcchQJCQtma983vAs60DgSr9T5CX0hLXc4Vrn/paPM5oiaKdCcIyDizRAAmrEjmrFziBttsLigo6FgxwfE9jykXrfRihwEIIDG99LHI0QUm4RB0AuGaKLQLYiLsp4irLyS0tyYcLinkIhfn9+f1BCZGmEApCCEMKznCaT54TeUJoHUyZWV1rF9Cw1i8zEu4I81kJjWy+8tMHgUrqoUeoiWZloAB0MJQ5AK//tUxAaACvCfTcYMz0FIE2dxhIzwLgGgZKi0rOtjscMwpWBgqOEBrW2kZiArfWNFU1Woy83MkVFqOAWIkUWWxImONRK1jh4+git1fW4nUPZUHhSVoTuLC6fbnSWyocHQFLbI2oAEBcgYJnSxnzoHzd0RDQ+YDQhKPZIoJsy/Vc1SbIYVtwvWGup/S1jf0mOkuzMa0KDASDCiz2kiPEUGuSPSqzpEREhKQUecDR2IgL/5KgAAIJAQDcG6UQdkwLCC//tUxAcDx7gY+UewwAAAADSAAAAEZA8sy3RUWQoWFyJn0gsLsioqLB78WFYhFRQW/ULs7dQuRxausUb+oXZirdQuzFRaTEFNRTMuMTAwqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqq",
};