export const mockDoc = `
<div data-controller="loading">
    <h1>PATTERNS</h1>
    <div data-target="loading.hide" id="page_content">
        <div data-controller="patterns--midi-device" id="page-container">
            <h3>fooo/new pattern</h3>
            <h3 data-target="patterns--midi-device.channel patterns--midi-device.patternId patterns--midi-device.projectId" device-channel="3" pattern-id="3" project-id="15">3</h3>
            <div class="video-preview" data-controller="patterns--video">
                <div class="progress"><div class="determinate" data-target="patterns--video.loadingBar"></div></div>
                <!-- Modal Structure -->
                <div id="text-modal" class="modal modal-fixed-footer" data-target="patterns--midi-device.textModal">
                    <div class="modal-content">
                        <h4 data-target="patterns--midi-device.textModalTitle" style="color: black;">Text</h4>
                        <input data-action="input->patterns--midi-device#onTextType" data-target="patterns--midi-device.inputValue" />
                    </div>
                    <div class="modal-footer">
                        <a data-action="patterns--midi-device#clearText" class="modal-close waves-effect waves-green btn-flat">clear</a>
                        <a class="modal-close waves-effect waves-green btn-flat">ok</a>
                    </div>
                </div>

                <span data-target="patterns--midi-device.noteText" id="note-text-text"></span>

                <video id="midi-video" class="video-js vjs-fluid" preload="auto" width="1000" data-target="patterns--video.video patterns--midi-device.video" controls>
                    <source
                        src="/rails/active_storage/blobs/eyJfcmFpbHMiOnsibWVzc2FnZSI6IkJBaHBGQT09IiwiZXhwIjpudWxsLCJwdXIiOiJibG9iX2lkIn19--1bcada6028b3786ff163900b17831746d07c7023/Cosmos_War_of_the_Planets.mp4"
                        type="video/mp4"
                    />
                </video>
            </div>
            <div id="pattern-container">
                <div
                    data-controller="patterns--keyboard"
                    data-notes-in-which-octave-identifier='{"0":0,"1":0,"2":0,"3":0,"4":0,"5":0,"6":0,"7":0,"8":0,"9":0,"10":0,"11":0,"12":1,"13":1,"14":1,"15":1,"16":1,"17":1,"18":1,"19":1,"20":1,"21":1,"22":1,"23":1,"24":2,"25":2,"26":2,"27":2,"28":2,"29":2,"30":2,"31":2,"32":2,"33":2,"34":2,"35":2,"36":3,"37":3,"38":3,"39":3,"40":3,"41":3,"42":3,"43":3,"44":3,"45":3,"46":3,"47":3,"48":4,"49":4,"50":4,"51":4,"52":4,"53":4,"54":4,"55":4,"56":4,"57":4,"58":4,"59":4,"60":5,"61":5,"62":5,"63":5,"64":5,"65":5,"66":5,"67":5,"68":5,"69":5,"70":5,"71":5,"72":6,"73":6,"74":6,"75":6,"76":6,"77":6,"78":6,"79":6,"80":6,"81":6,"82":6,"83":6,"84":7,"85":7,"86":7,"87":7,"88":7,"89":7,"90":7,"91":7,"92":7,"93":7,"94":7,"95":7,"96":8,"97":8,"98":8,"99":8,"100":8,"101":8}'
                    data-patterns--keyboard-final-index="8"
                    data-patterns--keyboard-notes='[[[0,"C0"],[1,"C#0"],[2,"D0"],[3,"D#0"],[4,"E0"],[5,"F0"],[6,"F#0"],[7,"G0"],[8,"G#0"],[9,"A0"],[10,"A#0"],[11,"B0"]],[[12,"C1"],[13,"C#1"],[14,"D1"],[15,"D#1"],[16,"E1"],[17,"F1"],[18,"F#1"],[19,"G1"],[20,"G#1"],[21,"A1"],[22,"A#1"],[23,"B1"]],[[24,"C2"],[25,"C#2"],[26,"D2"],[27,"D#2"],[28,"E2"],[29,"F2"],[30,"F#2"],[31,"G2"],[32,"G#2"],[33,"A2"],[34,"A#2"],[35,"B2"]],[[36,"C3"],[37,"C#3"],[38,"D3"],[39,"D#3"],[40,"E3"],[41,"F3"],[42,"F#3"],[43,"G3"],[44,"G#3"],[45,"A3"],[46,"A#3"],[47,"B3"]],[[48,"C4"],[49,"C#4"],[50,"D4"],[51,"D#4"],[52,"E4"],[53,"F4"],[54,"F#4"],[55,"G4"],[56,"G#4"],[57,"A4"],[58,"A#4"],[59,"B4"]],[[60,"C5"],[61,"C#5"],[62,"D5"],[63,"D#5"],[64,"E5"],[65,"F5"],[66,"F#5"],[67,"G5"],[68,"G#5"],[69,"A5"],[70,"A#5"],[71,"B5"]],[[72,"C6"],[73,"C#6"],[74,"D6"],[75,"D#6"],[76,"E6"],[77,"F6"],[78,"F#6"],[79,"G6"],[80,"G#6"],[81,"A6"],[82,"A#6"],[83,"B6"]],[[84,"C7"],[85,"C#7"],[86,"D7"],[87,"D#7"],[88,"E7"],[89,"F7"],[90,"F#7"],[91,"G7"],[92,"G#7"],[93,"A7"],[94,"A#7"],[95,"B7"]],[[96,"C8"],[97,"C#8"],[98,"D8"],[99,"D#8"],[100,"E8"],[101,"F8"],[102,"F#8"],[103,"G8"],[104,"G#8"],[105,"A8"],[106,"A#8"],[107,"B8"]]]'
                    data-patterns--keyboard-position="4"
                    data-target="patterns--midi-device.noteStamps"
                    note-stamps='{"55":1042.681,"56":86.906,"57":3043.525,"58":2228.885,"59":2250.324,"60":5173.867,"61":1340.723,"62":2751.202,"63":4292.778,"64":762.417,"65":4854.796,"66":355.776,"67":2448.15,"68":1901.916,"69":144.551}'
                    text-stamps="{}"
                >
                    <ul class="set z-depth-5">
                        <li class="hide white" data-target="patterns--keyboard.keyBoardKey patterns--midi-device.keyBoardKey" midi-note-number="0">
                            <span class="note-title">C0</span><br />
                            <br />
                            <input class="key" data-action="click-&gt;patterns--midi-device#onPianoKeyClick" id="0" type="text" />
                        </li>
                        <li class="hide grey darken-4" data-target="patterns--keyboard.keyBoardKey patterns--midi-device.keyBoardKey" midi-note-number="1">
                            <span class="note-title">C#0</span><br />
                            <br />
                            <input class="key" data-action="click-&gt;patterns--midi-device#onPianoKeyClick" id="1" type="text" />
                        </li>
                        <li class="hide white" data-target="patterns--keyboard.keyBoardKey patterns--midi-device.keyBoardKey" midi-note-number="2">
                            <span class="note-title">D0</span><br />
                            <br />
                            <input class="key" data-action="click-&gt;patterns--midi-device#onPianoKeyClick" id="2" type="text" />
                        </li>
                        <li class="hide grey darken-4" data-target="patterns--keyboard.keyBoardKey patterns--midi-device.keyBoardKey" midi-note-number="3">
                            <span class="note-title">D#0</span><br />
                            <br />
                            <input class="key" data-action="click-&gt;patterns--midi-device#onPianoKeyClick" id="3" type="text" />
                        </li>
                        <li class="hide white" data-target="patterns--keyboard.keyBoardKey patterns--midi-device.keyBoardKey" midi-note-number="4">
                            <span class="note-title">E0</span><br />
                            <br />
                            <input class="key" data-action="click-&gt;patterns--midi-device#onPianoKeyClick" id="4" type="text" />
                        </li>
                        <li class="hide white" data-target="patterns--keyboard.keyBoardKey patterns--midi-device.keyBoardKey" midi-note-number="5">
                            <span class="note-title">F0</span><br />
                            <br />
                            <input class="key" data-action="click-&gt;patterns--midi-device#onPianoKeyClick" id="5" type="text" />
                        </li>
                        <li class="hide grey darken-4" data-target="patterns--keyboard.keyBoardKey patterns--midi-device.keyBoardKey" midi-note-number="6">
                            <span class="note-title">F#0</span><br />
                            <br />
                            <input class="key" data-action="click-&gt;patterns--midi-device#onPianoKeyClick" id="6" type="text" />
                        </li>
                        <li class="hide white" data-target="patterns--keyboard.keyBoardKey patterns--midi-device.keyBoardKey" midi-note-number="7">
                            <span class="note-title">G0</span><br />
                            <br />
                            <input class="key" data-action="click-&gt;patterns--midi-device#onPianoKeyClick" id="7" type="text" />
                        </li>
                        <li class="hide grey darken-4" data-target="patterns--keyboard.keyBoardKey patterns--midi-device.keyBoardKey" midi-note-number="8">
                            <span class="note-title">G#0</span><br />
                            <br />
                            <input class="key" data-action="click-&gt;patterns--midi-device#onPianoKeyClick" id="8" type="text" />
                        </li>
                        <li class="hide white" data-target="patterns--keyboard.keyBoardKey patterns--midi-device.keyBoardKey" midi-note-number="9">
                            <span class="note-title">A0</span><br />
                            <br />
                            <input class="key" data-action="click-&gt;patterns--midi-device#onPianoKeyClick" id="9" type="text" />
                        </li>
                        <li class="hide grey darken-4" data-target="patterns--keyboard.keyBoardKey patterns--midi-device.keyBoardKey" midi-note-number="10">
                            <span class="note-title">A#0</span><br />
                            <br />
                            <input class="key" data-action="click-&gt;patterns--midi-device#onPianoKeyClick" id="10" type="text" />
                        </li>
                        <li class="hide white" data-target="patterns--keyboard.keyBoardKey patterns--midi-device.keyBoardKey" midi-note-number="11">
                            <span class="note-title">B0</span><br />
                            <br />
                            <input class="key" data-action="click-&gt;patterns--midi-device#onPianoKeyClick" id="11" type="text" />
                        </li>
                        <li class="hide white" data-target="patterns--keyboard.keyBoardKey patterns--midi-device.keyBoardKey" midi-note-number="12">
                            <span class="note-title">C1</span><br />
                            <br />
                            <input class="key" data-action="click-&gt;patterns--midi-device#onPianoKeyClick" id="12" type="text" />
                        </li>
                        <li class="hide grey darken-4" data-target="patterns--keyboard.keyBoardKey patterns--midi-device.keyBoardKey" midi-note-number="13">
                            <span class="note-title">C#1</span><br />
                            <br />
                            <input class="key" data-action="click-&gt;patterns--midi-device#onPianoKeyClick" id="13" type="text" />
                        </li>
                        <li class="hide white" data-target="patterns--keyboard.keyBoardKey patterns--midi-device.keyBoardKey" midi-note-number="14">
                            <span class="note-title">D1</span><br />
                            <br />
                            <input class="key" data-action="click-&gt;patterns--midi-device#onPianoKeyClick" id="14" type="text" />
                        </li>
                        <li class="hide grey darken-4" data-target="patterns--keyboard.keyBoardKey patterns--midi-device.keyBoardKey" midi-note-number="15">
                            <span class="note-title">D#1</span><br />
                            <br />
                            <input class="key" data-action="click-&gt;patterns--midi-device#onPianoKeyClick" id="15" type="text" />
                        </li>
                        <li class="hide white" data-target="patterns--keyboard.keyBoardKey patterns--midi-device.keyBoardKey" midi-note-number="16">
                            <span class="note-title">E1</span><br />
                            <br />
                            <input class="key" data-action="click-&gt;patterns--midi-device#onPianoKeyClick" id="16" type="text" />
                        </li>
                        <li class="hide white" data-target="patterns--keyboard.keyBoardKey patterns--midi-device.keyBoardKey" midi-note-number="17">
                            <span class="note-title">F1</span><br />
                            <br />
                            <input class="key" data-action="click-&gt;patterns--midi-device#onPianoKeyClick" id="17" type="text" />
                        </li>
                        <li class="hide grey darken-4" data-target="patterns--keyboard.keyBoardKey patterns--midi-device.keyBoardKey" midi-note-number="18">
                            <span class="note-title">F#1</span><br />
                            <br />
                            <input class="key" data-action="click-&gt;patterns--midi-device#onPianoKeyClick" id="18" type="text" />
                        </li>
                        <li class="hide white" data-target="patterns--keyboard.keyBoardKey patterns--midi-device.keyBoardKey" midi-note-number="19">
                            <span class="note-title">G1</span><br />
                            <br />
                            <input class="key" data-action="click-&gt;patterns--midi-device#onPianoKeyClick" id="19" type="text" />
                        </li>
                        <li class="hide grey darken-4" data-target="patterns--keyboard.keyBoardKey patterns--midi-device.keyBoardKey" midi-note-number="20">
                            <span class="note-title">G#1</span><br />
                            <br />
                            <input class="key" data-action="click-&gt;patterns--midi-device#onPianoKeyClick" id="20" type="text" />
                        </li>
                        <li class="hide white" data-target="patterns--keyboard.keyBoardKey patterns--midi-device.keyBoardKey" midi-note-number="21">
                            <span class="note-title">A1</span><br />
                            <br />
                            <input class="key" data-action="click-&gt;patterns--midi-device#onPianoKeyClick" id="21" type="text" />
                        </li>
                        <li class="hide grey darken-4" data-target="patterns--keyboard.keyBoardKey patterns--midi-device.keyBoardKey" midi-note-number="22">
                            <span class="note-title">A#1</span><br />
                            <br />
                            <input class="key" data-action="click-&gt;patterns--midi-device#onPianoKeyClick" id="22" type="text" />
                        </li>
                        <li class="hide white" data-target="patterns--keyboard.keyBoardKey patterns--midi-device.keyBoardKey" midi-note-number="23">
                            <span class="note-title">B1</span><br />
                            <br />
                            <input class="key" data-action="click-&gt;patterns--midi-device#onPianoKeyClick" id="23" type="text" />
                        </li>
                        <li class="hide white" data-target="patterns--keyboard.keyBoardKey patterns--midi-device.keyBoardKey" midi-note-number="24">
                            <span class="note-title">C2</span><br />
                            <br />
                            <input class="key" data-action="click-&gt;patterns--midi-device#onPianoKeyClick" id="24" type="text" />
                        </li>
                        <li class="hide grey darken-4" data-target="patterns--keyboard.keyBoardKey patterns--midi-device.keyBoardKey" midi-note-number="25">
                            <span class="note-title">C#2</span><br />
                            <br />
                            <input class="key" data-action="click-&gt;patterns--midi-device#onPianoKeyClick" id="25" type="text" />
                        </li>
                        <li class="hide white" data-target="patterns--keyboard.keyBoardKey patterns--midi-device.keyBoardKey" midi-note-number="26">
                            <span class="note-title">D2</span><br />
                            <br />
                            <input class="key" data-action="click-&gt;patterns--midi-device#onPianoKeyClick" id="26" type="text" />
                        </li>
                        <li class="hide grey darken-4" data-target="patterns--keyboard.keyBoardKey patterns--midi-device.keyBoardKey" midi-note-number="27">
                            <span class="note-title">D#2</span><br />
                            <br />
                            <input class="key" data-action="click-&gt;patterns--midi-device#onPianoKeyClick" id="27" type="text" />
                        </li>
                        <li class="hide white" data-target="patterns--keyboard.keyBoardKey patterns--midi-device.keyBoardKey" midi-note-number="28">
                            <span class="note-title">E2</span><br />
                            <br />
                            <input class="key" data-action="click-&gt;patterns--midi-device#onPianoKeyClick" id="28" type="text" />
                        </li>
                        <li class="hide white" data-target="patterns--keyboard.keyBoardKey patterns--midi-device.keyBoardKey" midi-note-number="29">
                            <span class="note-title">F2</span><br />
                            <br />
                            <input class="key" data-action="click-&gt;patterns--midi-device#onPianoKeyClick" id="29" type="text" />
                        </li>
                        <li class="hide grey darken-4" data-target="patterns--keyboard.keyBoardKey patterns--midi-device.keyBoardKey" midi-note-number="30">
                            <span class="note-title">F#2</span><br />
                            <br />
                            <input class="key" data-action="click-&gt;patterns--midi-device#onPianoKeyClick" id="30" type="text" />
                        </li>
                        <li class="hide white" data-target="patterns--keyboard.keyBoardKey patterns--midi-device.keyBoardKey" midi-note-number="31">
                            <span class="note-title">G2</span><br />
                            <br />
                            <input class="key" data-action="click-&gt;patterns--midi-device#onPianoKeyClick" id="31" type="text" />
                        </li>
                        <li class="hide grey darken-4" data-target="patterns--keyboard.keyBoardKey patterns--midi-device.keyBoardKey" midi-note-number="32">
                            <span class="note-title">G#2</span><br />
                            <br />
                            <input class="key" data-action="click-&gt;patterns--midi-device#onPianoKeyClick" id="32" type="text" />
                        </li>
                        <li class="hide white" data-target="patterns--keyboard.keyBoardKey patterns--midi-device.keyBoardKey" midi-note-number="33">
                            <span class="note-title">A2</span><br />
                            <br />
                            <input class="key" data-action="click-&gt;patterns--midi-device#onPianoKeyClick" id="33" type="text" />
                        </li>
                        <li class="hide grey darken-4" data-target="patterns--keyboard.keyBoardKey patterns--midi-device.keyBoardKey" midi-note-number="34">
                            <span class="note-title">A#2</span><br />
                            <br />
                            <input class="key" data-action="click-&gt;patterns--midi-device#onPianoKeyClick" id="34" type="text" />
                        </li>
                        <li class="hide white" data-target="patterns--keyboard.keyBoardKey patterns--midi-device.keyBoardKey" midi-note-number="35">
                            <span class="note-title">B2</span><br />
                            <br />
                            <input class="key" data-action="click-&gt;patterns--midi-device#onPianoKeyClick" id="35" type="text" />
                        </li>
                        <li class="hide white" data-target="patterns--keyboard.keyBoardKey patterns--midi-device.keyBoardKey" midi-note-number="36">
                            <span class="note-title">C3</span><br />
                            <br />
                            <input class="key" data-action="click-&gt;patterns--midi-device#onPianoKeyClick" id="36" type="text" />
                        </li>
                        <li class="hide grey darken-4" data-target="patterns--keyboard.keyBoardKey patterns--midi-device.keyBoardKey" midi-note-number="37">
                            <span class="note-title">C#3</span><br />
                            <br />
                            <input class="key" data-action="click-&gt;patterns--midi-device#onPianoKeyClick" id="37" type="text" />
                        </li>
                        <li class="hide white" data-target="patterns--keyboard.keyBoardKey patterns--midi-device.keyBoardKey" midi-note-number="38">
                            <span class="note-title">D3</span><br />
                            <br />
                            <input class="key" data-action="click-&gt;patterns--midi-device#onPianoKeyClick" id="38" type="text" />
                        </li>
                        <li class="hide grey darken-4" data-target="patterns--keyboard.keyBoardKey patterns--midi-device.keyBoardKey" midi-note-number="39">
                            <span class="note-title">D#3</span><br />
                            <br />
                            <input class="key" data-action="click-&gt;patterns--midi-device#onPianoKeyClick" id="39" type="text" />
                        </li>
                        <li class="hide white" data-target="patterns--keyboard.keyBoardKey patterns--midi-device.keyBoardKey" midi-note-number="40">
                            <span class="note-title">E3</span><br />
                            <br />
                            <input class="key" data-action="click-&gt;patterns--midi-device#onPianoKeyClick" id="40" type="text" />
                        </li>
                        <li class="hide white" data-target="patterns--keyboard.keyBoardKey patterns--midi-device.keyBoardKey" midi-note-number="41">
                            <span class="note-title">F3</span><br />
                            <br />
                            <input class="key" data-action="click-&gt;patterns--midi-device#onPianoKeyClick" id="41" type="text" />
                        </li>
                        <li class="hide grey darken-4" data-target="patterns--keyboard.keyBoardKey patterns--midi-device.keyBoardKey" midi-note-number="42">
                            <span class="note-title">F#3</span><br />
                            <br />
                            <input class="key" data-action="click-&gt;patterns--midi-device#onPianoKeyClick" id="42" type="text" />
                        </li>
                        <li class="hide white" data-target="patterns--keyboard.keyBoardKey patterns--midi-device.keyBoardKey" midi-note-number="43">
                            <span class="note-title">G3</span><br />
                            <br />
                            <input class="key" data-action="click-&gt;patterns--midi-device#onPianoKeyClick" id="43" type="text" />
                        </li>
                        <li class="hide grey darken-4" data-target="patterns--keyboard.keyBoardKey patterns--midi-device.keyBoardKey" midi-note-number="44">
                            <span class="note-title">G#3</span><br />
                            <br />
                            <input class="key" data-action="click-&gt;patterns--midi-device#onPianoKeyClick" id="44" type="text" />
                        </li>
                        <li class="hide white" data-target="patterns--keyboard.keyBoardKey patterns--midi-device.keyBoardKey" midi-note-number="45">
                            <span class="note-title">A3</span><br />
                            <br />
                            <input class="key" data-action="click-&gt;patterns--midi-device#onPianoKeyClick" id="45" type="text" />
                        </li>
                        <li class="hide grey darken-4" data-target="patterns--keyboard.keyBoardKey patterns--midi-device.keyBoardKey" midi-note-number="46">
                            <span class="note-title">A#3</span><br />
                            <br />
                            <input class="key" data-action="click-&gt;patterns--midi-device#onPianoKeyClick" id="46" type="text" />
                        </li>
                        <li class="hide white" data-target="patterns--keyboard.keyBoardKey patterns--midi-device.keyBoardKey" midi-note-number="47">
                            <span class="note-title">B3</span><br />
                            <br />
                            <input class="key" data-action="click-&gt;patterns--midi-device#onPianoKeyClick" id="47" type="text" />
                        </li>
                        <li class="white" data-target="patterns--keyboard.keyBoardKey patterns--midi-device.keyBoardKey" midi-note-number="48">
                            <span class="note-title">C4</span><br />
                            <br />
                            <input class="key" data-action="click-&gt;patterns--midi-device#onPianoKeyClick" id="48" type="text" />
                        </li>
                        <li class="grey darken-4" data-target="patterns--keyboard.keyBoardKey patterns--midi-device.keyBoardKey" midi-note-number="49">
                            <span class="note-title">C#4</span><br />
                            <br />
                            <input class="key" data-action="click-&gt;patterns--midi-device#onPianoKeyClick" id="49" type="text" />
                        </li>
                        <li class="white" data-target="patterns--keyboard.keyBoardKey patterns--midi-device.keyBoardKey" midi-note-number="50">
                            <span class="note-title">D4</span><br />
                            <br />
                            <input class="key" data-action="click-&gt;patterns--midi-device#onPianoKeyClick" id="50" type="text" />
                        </li>
                        <li class="grey darken-4" data-target="patterns--keyboard.keyBoardKey patterns--midi-device.keyBoardKey" midi-note-number="51">
                            <span class="note-title">D#4</span><br />
                            <br />
                            <input class="key" data-action="click-&gt;patterns--midi-device#onPianoKeyClick" id="51" type="text" />
                        </li>
                        <li class="white" data-target="patterns--keyboard.keyBoardKey patterns--midi-device.keyBoardKey" midi-note-number="52">
                            <span class="note-title">E4</span><br />
                            <br />
                            <input class="key" data-action="click-&gt;patterns--midi-device#onPianoKeyClick" id="52" type="text" />
                        </li>
                        <li class="white" data-target="patterns--keyboard.keyBoardKey patterns--midi-device.keyBoardKey" midi-note-number="53">
                            <span class="note-title">F4</span><br />
                            <br />
                            <input class="key" data-action="click-&gt;patterns--midi-device#onPianoKeyClick" id="53" type="text" />
                        </li>
                        <li class="grey darken-4" data-target="patterns--keyboard.keyBoardKey patterns--midi-device.keyBoardKey" midi-note-number="54">
                            <span class="note-title">F#4</span><br />
                            <br />
                            <input class="key" data-action="click-&gt;patterns--midi-device#onPianoKeyClick" id="54" type="text" />
                        </li>
                        <li class="white" data-target="patterns--keyboard.keyBoardKey patterns--midi-device.keyBoardKey" midi-note-number="55">
                            <span class="note-title">G4</span><br />
                            <br />
                            <input class="key" data-action="click-&gt;patterns--midi-device#onPianoKeyClick" id="55" type="text" value="1042.681" />
                        </li>
                        <li class="grey darken-4" data-target="patterns--keyboard.keyBoardKey patterns--midi-device.keyBoardKey" midi-note-number="56">
                            <span class="note-title">G#4</span><br />
                            <br />
                            <input class="key" data-action="click-&gt;patterns--midi-device#onPianoKeyClick" id="56" type="text" value="86.906" />
                        </li>
                        <li class="white" data-target="patterns--keyboard.keyBoardKey patterns--midi-device.keyBoardKey" midi-note-number="57">
                            <span class="note-title">A4</span><br />
                            <br />
                            <input class="key" data-action="click-&gt;patterns--midi-device#onPianoKeyClick" id="57" type="text" value="3043.525" />
                        </li>
                        <li class="grey darken-4" data-target="patterns--keyboard.keyBoardKey patterns--midi-device.keyBoardKey" midi-note-number="58">
                            <span class="note-title">A#4</span><br />
                            <br />
                            <input class="key" data-action="click-&gt;patterns--midi-device#onPianoKeyClick" id="58" type="text" value="2228.885" />
                        </li>
                        <li class="white" data-target="patterns--keyboard.keyBoardKey patterns--midi-device.keyBoardKey" midi-note-number="59">
                            <span class="note-title">B4</span><br />
                            <br />
                            <input class="key" data-action="click-&gt;patterns--midi-device#onPianoKeyClick" id="59" type="text" value="2250.324" />
                        </li>
                        <li class="hide white" data-target="patterns--keyboard.keyBoardKey patterns--midi-device.keyBoardKey" midi-note-number="60">
                            <span class="note-title">C5</span><br />
                            <br />
                            <input class="key" data-action="click-&gt;patterns--midi-device#onPianoKeyClick" id="60" type="text" value="5173.867" />
                        </li>
                        <li class="hide grey darken-4" data-target="patterns--keyboard.keyBoardKey patterns--midi-device.keyBoardKey" midi-note-number="61">
                            <span class="note-title">C#5</span><br />
                            <br />
                            <input class="key" data-action="click-&gt;patterns--midi-device#onPianoKeyClick" id="61" type="text" value="1340.723" />
                        </li>
                        <li class="hide white" data-target="patterns--keyboard.keyBoardKey patterns--midi-device.keyBoardKey" midi-note-number="62">
                            <span class="note-title">D5</span><br />
                            <br />
                            <input class="key" data-action="click-&gt;patterns--midi-device#onPianoKeyClick" id="62" type="text" value="2751.202" />
                        </li>
                        <li class="hide grey darken-4" data-target="patterns--keyboard.keyBoardKey patterns--midi-device.keyBoardKey" midi-note-number="63">
                            <span class="note-title">D#5</span><br />
                            <br />
                            <input class="key" data-action="click-&gt;patterns--midi-device#onPianoKeyClick" id="63" type="text" value="4292.778" />
                        </li>
                        <li class="hide white" data-target="patterns--keyboard.keyBoardKey patterns--midi-device.keyBoardKey" midi-note-number="64">
                            <span class="note-title">E5</span><br />
                            <br />
                            <input class="key" data-action="click-&gt;patterns--midi-device#onPianoKeyClick" id="64" type="text" value="762.417" />
                        </li>
                        <li class="hide white" data-target="patterns--keyboard.keyBoardKey patterns--midi-device.keyBoardKey" midi-note-number="65">
                            <span class="note-title">F5</span><br />
                            <br />
                            <input class="key" data-action="click-&gt;patterns--midi-device#onPianoKeyClick" id="65" type="text" value="4854.796" />
                        </li>
                        <li class="hide grey darken-4" data-target="patterns--keyboard.keyBoardKey patterns--midi-device.keyBoardKey" midi-note-number="66">
                            <span class="note-title">F#5</span><br />
                            <br />
                            <input class="key" data-action="click-&gt;patterns--midi-device#onPianoKeyClick" id="66" type="text" value="355.776" />
                        </li>
                        <li class="hide white" data-target="patterns--keyboard.keyBoardKey patterns--midi-device.keyBoardKey" midi-note-number="67">
                            <span class="note-title">G5</span><br />
                            <br />
                            <input class="key" data-action="click-&gt;patterns--midi-device#onPianoKeyClick" id="67" type="text" value="2448.15" />
                        </li>
                        <li class="hide grey darken-4" data-target="patterns--keyboard.keyBoardKey patterns--midi-device.keyBoardKey" midi-note-number="68">
                            <span class="note-title">G#5</span><br />
                            <br />
                            <input class="key" data-action="click-&gt;patterns--midi-device#onPianoKeyClick" id="68" type="text" value="1901.916" />
                        </li>
                        <li class="hide white" data-target="patterns--keyboard.keyBoardKey patterns--midi-device.keyBoardKey" midi-note-number="69">
                            <span class="note-title">A5</span><br />
                            <br />
                            <input class="key" data-action="click-&gt;patterns--midi-device#onPianoKeyClick" id="69" type="text" value="144.551" />
                        </li>
                        <li class="hide grey darken-4" data-target="patterns--keyboard.keyBoardKey patterns--midi-device.keyBoardKey" midi-note-number="70">
                            <span class="note-title">A#5</span><br />
                            <br />
                            <input class="key" data-action="click-&gt;patterns--midi-device#onPianoKeyClick" id="70" type="text" />
                        </li>
                        <li class="hide white" data-target="patterns--keyboard.keyBoardKey patterns--midi-device.keyBoardKey" midi-note-number="71">
                            <span class="note-title">B5</span><br />
                            <br />
                            <input class="key" data-action="click-&gt;patterns--midi-device#onPianoKeyClick" id="71" type="text" />
                        </li>
                        <li class="hide white" data-target="patterns--keyboard.keyBoardKey patterns--midi-device.keyBoardKey" midi-note-number="72">
                            <span class="note-title">C6</span><br />
                            <br />
                            <input class="key" data-action="click-&gt;patterns--midi-device#onPianoKeyClick" id="72" type="text" />
                        </li>
                        <li class="hide grey darken-4" data-target="patterns--keyboard.keyBoardKey patterns--midi-device.keyBoardKey" midi-note-number="73">
                            <span class="note-title">C#6</span><br />
                            <br />
                            <input class="key" data-action="click-&gt;patterns--midi-device#onPianoKeyClick" id="73" type="text" />
                        </li>
                        <li class="hide white" data-target="patterns--keyboard.keyBoardKey patterns--midi-device.keyBoardKey" midi-note-number="74">
                            <span class="note-title">D6</span><br />
                            <br />
                            <input class="key" data-action="click-&gt;patterns--midi-device#onPianoKeyClick" id="74" type="text" />
                        </li>
                        <li class="hide grey darken-4" data-target="patterns--keyboard.keyBoardKey patterns--midi-device.keyBoardKey" midi-note-number="75">
                            <span class="note-title">D#6</span><br />
                            <br />
                            <input class="key" data-action="click-&gt;patterns--midi-device#onPianoKeyClick" id="75" type="text" />
                        </li>
                        <li class="hide white" data-target="patterns--keyboard.keyBoardKey patterns--midi-device.keyBoardKey" midi-note-number="76">
                            <span class="note-title">E6</span><br />
                            <br />
                            <input class="key" data-action="click-&gt;patterns--midi-device#onPianoKeyClick" id="76" type="text" />
                        </li>
                        <li class="hide white" data-target="patterns--keyboard.keyBoardKey patterns--midi-device.keyBoardKey" midi-note-number="77">
                            <span class="note-title">F6</span><br />
                            <br />
                            <input class="key" data-action="click-&gt;patterns--midi-device#onPianoKeyClick" id="77" type="text" />
                        </li>
                        <li class="hide grey darken-4" data-target="patterns--keyboard.keyBoardKey patterns--midi-device.keyBoardKey" midi-note-number="78">
                            <span class="note-title">F#6</span><br />
                            <br />
                            <input class="key" data-action="click-&gt;patterns--midi-device#onPianoKeyClick" id="78" type="text" />
                        </li>
                        <li class="hide white" data-target="patterns--keyboard.keyBoardKey patterns--midi-device.keyBoardKey" midi-note-number="79">
                            <span class="note-title">G6</span><br />
                            <br />
                            <input class="key" data-action="click-&gt;patterns--midi-device#onPianoKeyClick" id="79" type="text" />
                        </li>
                        <li class="hide grey darken-4" data-target="patterns--keyboard.keyBoardKey patterns--midi-device.keyBoardKey" midi-note-number="80">
                            <span class="note-title">G#6</span><br />
                            <br />
                            <input class="key" data-action="click-&gt;patterns--midi-device#onPianoKeyClick" id="80" type="text" />
                        </li>
                        <li class="hide white" data-target="patterns--keyboard.keyBoardKey patterns--midi-device.keyBoardKey" midi-note-number="81">
                            <span class="note-title">A6</span><br />
                            <br />
                            <input class="key" data-action="click-&gt;patterns--midi-device#onPianoKeyClick" id="81" type="text" />
                        </li>
                        <li class="hide grey darken-4" data-target="patterns--keyboard.keyBoardKey patterns--midi-device.keyBoardKey" midi-note-number="82">
                            <span class="note-title">A#6</span><br />
                            <br />
                            <input class="key" data-action="click-&gt;patterns--midi-device#onPianoKeyClick" id="82" type="text" />
                        </li>
                        <li class="hide white" data-target="patterns--keyboard.keyBoardKey patterns--midi-device.keyBoardKey" midi-note-number="83">
                            <span class="note-title">B6</span><br />
                            <br />
                            <input class="key" data-action="click-&gt;patterns--midi-device#onPianoKeyClick" id="83" type="text" />
                        </li>
                        <li class="hide white" data-target="patterns--keyboard.keyBoardKey patterns--midi-device.keyBoardKey" midi-note-number="84">
                            <span class="note-title">C7</span><br />
                            <br />
                            <input class="key" data-action="click-&gt;patterns--midi-device#onPianoKeyClick" id="84" type="text" />
                        </li>
                        <li class="hide grey darken-4" data-target="patterns--keyboard.keyBoardKey patterns--midi-device.keyBoardKey" midi-note-number="85">
                            <span class="note-title">C#7</span><br />
                            <br />
                            <input class="key" data-action="click-&gt;patterns--midi-device#onPianoKeyClick" id="85" type="text" />
                        </li>
                        <li class="hide white" data-target="patterns--keyboard.keyBoardKey patterns--midi-device.keyBoardKey" midi-note-number="86">
                            <span class="note-title">D7</span><br />
                            <br />
                            <input class="key" data-action="click-&gt;patterns--midi-device#onPianoKeyClick" id="86" type="text" />
                        </li>
                        <li class="hide grey darken-4" data-target="patterns--keyboard.keyBoardKey patterns--midi-device.keyBoardKey" midi-note-number="87">
                            <span class="note-title">D#7</span><br />
                            <br />
                            <input class="key" data-action="click-&gt;patterns--midi-device#onPianoKeyClick" id="87" type="text" />
                        </li>
                        <li class="hide white" data-target="patterns--keyboard.keyBoardKey patterns--midi-device.keyBoardKey" midi-note-number="88">
                            <span class="note-title">E7</span><br />
                            <br />
                            <input class="key" data-action="click-&gt;patterns--midi-device#onPianoKeyClick" id="88" type="text" />
                        </li>
                        <li class="hide white" data-target="patterns--keyboard.keyBoardKey patterns--midi-device.keyBoardKey" midi-note-number="89">
                            <span class="note-title">F7</span><br />
                            <br />
                            <input class="key" data-action="click-&gt;patterns--midi-device#onPianoKeyClick" id="89" type="text" />
                        </li>
                        <li class="hide grey darken-4" data-target="patterns--keyboard.keyBoardKey patterns--midi-device.keyBoardKey" midi-note-number="90">
                            <span class="note-title">F#7</span><br />
                            <br />
                            <input class="key" data-action="click-&gt;patterns--midi-device#onPianoKeyClick" id="90" type="text" />
                        </li>
                        <li class="hide white" data-target="patterns--keyboard.keyBoardKey patterns--midi-device.keyBoardKey" midi-note-number="91">
                            <span class="note-title">G7</span><br />
                            <br />
                            <input class="key" data-action="click-&gt;patterns--midi-device#onPianoKeyClick" id="91" type="text" />
                        </li>
                        <li class="hide grey darken-4" data-target="patterns--keyboard.keyBoardKey patterns--midi-device.keyBoardKey" midi-note-number="92">
                            <span class="note-title">G#7</span><br />
                            <br />
                            <input class="key" data-action="click-&gt;patterns--midi-device#onPianoKeyClick" id="92" type="text" />
                        </li>
                        <li class="hide white" data-target="patterns--keyboard.keyBoardKey patterns--midi-device.keyBoardKey" midi-note-number="93">
                            <span class="note-title">A7</span><br />
                            <br />
                            <input class="key" data-action="click-&gt;patterns--midi-device#onPianoKeyClick" id="93" type="text" />
                        </li>
                        <li class="hide grey darken-4" data-target="patterns--keyboard.keyBoardKey patterns--midi-device.keyBoardKey" midi-note-number="94">
                            <span class="note-title">A#7</span><br />
                            <br />
                            <input class="key" data-action="click-&gt;patterns--midi-device#onPianoKeyClick" id="94" type="text" />
                        </li>
                        <li class="hide white" data-target="patterns--keyboard.keyBoardKey patterns--midi-device.keyBoardKey" midi-note-number="95">
                            <span class="note-title">B7</span><br />
                            <br />
                            <input class="key" data-action="click-&gt;patterns--midi-device#onPianoKeyClick" id="95" type="text" />
                        </li>
                        <li class="hide white" data-target="patterns--keyboard.keyBoardKey patterns--midi-device.keyBoardKey" midi-note-number="96">
                            <span class="note-title">C8</span><br />
                            <br />
                            <input class="key" data-action="click-&gt;patterns--midi-device#onPianoKeyClick" id="96" type="text" />
                        </li>
                        <li class="hide grey darken-4" data-target="patterns--keyboard.keyBoardKey patterns--midi-device.keyBoardKey" midi-note-number="97">
                            <span class="note-title">C#8</span><br />
                            <br />
                            <input class="key" data-action="click-&gt;patterns--midi-device#onPianoKeyClick" id="97" type="text" />
                        </li>
                        <li class="hide white" data-target="patterns--keyboard.keyBoardKey patterns--midi-device.keyBoardKey" midi-note-number="98">
                            <span class="note-title">D8</span><br />
                            <br />
                            <input class="key" data-action="click-&gt;patterns--midi-device#onPianoKeyClick" id="98" type="text" />
                        </li>
                        <li class="hide grey darken-4" data-target="patterns--keyboard.keyBoardKey patterns--midi-device.keyBoardKey" midi-note-number="99">
                            <span class="note-title">D#8</span><br />
                            <br />
                            <input class="key" data-action="click-&gt;patterns--midi-device#onPianoKeyClick" id="99" type="text" />
                        </li>
                        <li class="hide white" data-target="patterns--keyboard.keyBoardKey patterns--midi-device.keyBoardKey" midi-note-number="100">
                            <span class="note-title">E8</span><br />
                            <br />
                            <input class="key" data-action="click-&gt;patterns--midi-device#onPianoKeyClick" id="100" type="text" />
                        </li>
                        <li class="hide white" data-target="patterns--keyboard.keyBoardKey patterns--midi-device.keyBoardKey" midi-note-number="101">
                            <span class="note-title">F8</span><br />
                            <br />
                            <input class="key" data-action="click-&gt;patterns--midi-device#onPianoKeyClick" id="101" type="text" />
                        </li>
                        <li class="hide grey darken-4" data-target="patterns--keyboard.keyBoardKey patterns--midi-device.keyBoardKey" midi-note-number="102">
                            <span class="note-title">F#8</span><br />
                            <br />
                            <input class="key" data-action="click-&gt;patterns--midi-device#onPianoKeyClick" id="102" type="text" />
                        </li>
                        <li class="hide white" data-target="patterns--keyboard.keyBoardKey patterns--midi-device.keyBoardKey" midi-note-number="103">
                            <span class="note-title">G8</span><br />
                            <br />
                            <input class="key" data-action="click-&gt;patterns--midi-device#onPianoKeyClick" id="103" type="text" />
                        </li>
                        <li class="hide grey darken-4" data-target="patterns--keyboard.keyBoardKey patterns--midi-device.keyBoardKey" midi-note-number="104">
                            <span class="note-title">G#8</span><br />
                            <br />
                            <input class="key" data-action="click-&gt;patterns--midi-device#onPianoKeyClick" id="104" type="text" />
                        </li>
                        <li class="hide white" data-target="patterns--keyboard.keyBoardKey patterns--midi-device.keyBoardKey" midi-note-number="105">
                            <span class="note-title">A8</span><br />
                            <br />
                            <input class="key" data-action="click-&gt;patterns--midi-device#onPianoKeyClick" id="105" type="text" />
                        </li>
                        <li class="hide grey darken-4" data-target="patterns--keyboard.keyBoardKey patterns--midi-device.keyBoardKey" midi-note-number="106">
                            <span class="note-title">A#8</span><br />
                            <br />
                            <input class="key" data-action="click-&gt;patterns--midi-device#onPianoKeyClick" id="106" type="text" />
                        </li>
                        <li class="hide white" data-target="patterns--keyboard.keyBoardKey patterns--midi-device.keyBoardKey" midi-note-number="107">
                            <span class="note-title">B8</span><br />
                            <br />
                            <input class="key" data-action="click-&gt;patterns--midi-device#onPianoKeyClick" id="107" type="text" />
                        </li>
                    </ul>
                    <div class="row">
                        <a class="btn-floating btn-large waves-effect waves-light black darken-4 z-depth-5" data-action="patterns--keyboard#prev" data-target="patterns--midi-device.buttonMinus" id="octave-minus">
                            <i class="material-icons"> keyboard_arrow_left</i>
                        </a>
                        <a
                            class="btn-floating btn-large waves-effect waves-light black darken-1 z-depth-5"
                            data-action="patterns--midi-device#toggleRecordingSession"
                            data-target="patterns--midi-device.recordButton"
                            id="record"
                            total-clock-signals="384"
                        >
                            <i class="material-icons"> panorama_fish_eye</i>
                        </a>
                        <a class="btn-floating btn-large waves-effect waves-light black lighten-2 z-depth-5" data-action="patterns--midi-device#generatePatternClip" id="complete"><i class="material-icons"> launch</i></a>
                        <a class="btn-floating btn-large waves-effect waves-light black lighten-2 z-depth-5" data-action="patterns--midi-device#save" id="save"><i class="material-icons"> save</i></a>
                        <a class="btn-floating btn-large waves-effect waves-light black darken-4 z-depth-5" data-action="patterns--keyboard#next" data-target="patterns--midi-device.buttonPlus" id="octave-plus">
                            <i class="material-icons"> keyboard_arrow_right</i>
                        </a>
                        <a
                            class="btn-floating btn-large waves-effect waves-light black lighten-2 z-depth-5"
                            data-action="patterns--midi-device#saveAndNavigate"
                            data-target="patterns--midi-device.settings"
                            id="settings"
                            nav-url="/pattern-settings/3/15"
                        >
                            <i class="material-icons"> settings</i>
                        </a>
                        <a class="btn-floating btn-large waves-effect waves-light black lighten-2 z-depth-5" data-action="patterns--midi-device#saveCurrentTime" data-target="patterns--midi-device.saveCurrentTime" id="settings">
                            <i class="material-icons"> adjust</i>
                        </a>
                        <a class="btn-floating btn-large waves-effect waves-light black lighten-2 z-depth-5" data-action="patterns--midi-device#addText" data-target="patterns--midi-device.addTextButton" id="settings">
                            <i class="material-icons"> format_color_text</i>
                        </a>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <div class="hidden" data-target="loading.show" id="loading_bar">
        <div class="progress"><div class="indeterminate"></div></div>
    </div>
</div>
`