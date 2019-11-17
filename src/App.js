import React from 'react';
import './App.css';
import VideoSelectorContainer from './containers/VideoSelectorContainer.js'
import ProjectManagerContainer from './containers/ProjectManagerContainer.js'
import {
  videoSelectorGet
} from './network.js'
import BrowserMidiCollector from  './classes/BrowserMidiCollector.js'
import Splash from './Splash.js'

const midi =[{"data":["148","31","100"],"timeStamp":5254.274999955669},{"data":["149","60","100"],"timeStamp":5502.5799999712035},{"data":["133","60","0"],"timeStamp":5659.009999944828},{"data":["149","59","100"],"timeStamp":5768.0099999997765},{"data":["133","59","0"],"timeStamp":5898.4749999362975},{"data":["149","57","100"],"timeStamp":6013.279999955557},{"data":["133","57","0"],"timeStamp":6148.0599999194965},{"data":["149","60","100"],"timeStamp":6252.714999951422},{"data":["133","60","0"],"timeStamp":6419.394999975339},{"data":["149","59","100"],"timeStamp":6496.45499989856},{"data":["133","59","0"],"timeStamp":6648.664999986067},{"data":["149","57","100"],"timeStamp":6742.599999997765},{"data":["133","57","0"],"timeStamp":6876.704999944195},{"data":["148","33","100"],"timeStamp":6991.379999904893},{"data":["149","60","100"],"timeStamp":6997.229999979027},{"data":["132","31","0"],"timeStamp":7069.5349999004975},{"data":["148","59","0"],"timeStamp":6969.5349999004975},{"data":["133","60","0"],"timeStamp":7117.409999947995},{"data":["149","57","100"],"timeStamp":7236.564999911934},{"data":["133","57","0"],"timeStamp":7419.314999948256},{"data":["149","60","100"],"timeStamp":7502.229999983683},{"data":["133","60","0"],"timeStamp":7658.9149999199435},{"data":["149","59","100"],"timeStamp":7767.904999898747},{"data":["133","59","0"],"timeStamp":7898.369999951683},{"data":["149","57","100"],"timeStamp":8013.004999957047},{"data":["133","57","0"],"timeStamp":8147.874999907799},{"data":["149","60","100"],"timeStamp":8252.469999948516},{"data":["133","60","0"],"timeStamp":8419.13499997463},{"data":["148","36","100"],"timeStamp":8491.999999969266},{"data":["149","59","100"],"timeStamp":8497.689999989234},{"data":["132","33","0"],"timeStamp":8560.059999930672},{"data":["133","59","0"],"timeStamp":8648.449999978766},{"data":["149","57","100"],"timeStamp":8741.449999972247},{"data":["133","57","0"],"timeStamp":8877.714999951422},{"data":["149","60","100"],"timeStamp":8997.019999893382},{"data":["133","60","0"],"timeStamp":9117.339999997057},{"data":["149","57","100"],"timeStamp":9236.329999985173},{"data":["148","29","100"],"timeStamp":9242.199999978766},{"data":["132","36","0"],"timeStamp":9304.329999955371},{"data":["133","57","0"],"timeStamp":9419.049999909475},{"data":["149","60","100"],"timeStamp":9501.994999940507},{"data":["133","60","0"],"timeStamp":9658.594999928027},{"data":["149","59","100"],"timeStamp":9767.609999980778},{"data":["133","59","0"],"timeStamp":9898.119999910705},{"data":["149","57","100"],"timeStamp":10012.81999994535},{"data":["133","57","0"],"timeStamp":10147.549999994226},{"data":["149","60","100"],"timeStamp":10252.179999952205},{"data":["133","60","0"],"timeStamp":10418.874999973923},{"data":["149","59","100"],"timeStamp":10497.449999907985},{"data":["133","59","0"],"timeStamp":10648.169999942183},{"data":["149","57","100"],"timeStamp":10741.154999937862},{"data":["133","57","0"],"timeStamp":10877.654999960214},{"data":["149","60","100"],"timeStamp":10996.649999986403},{"data":["133","60","0"],"timeStamp":11116.904999944381},{"data":["149","57","100"],"timeStamp":11236.034999950789},{"data":["133","57","0"],"timeStamp":11418.764999951236},{"data":["148","33","100"],"timeStamp":11481.254999991506},{"data":["149","60","100"],"timeStamp":11501.639999914914},{"data":["132","29","0"],"timeStamp":11559.634999954142},{"data":["133","60","0"],"timeStamp":11658.179999911226},{"data":["149","59","100"],"timeStamp":11767.289999988861},{"data":["133","59","0"],"timeStamp":11897.789999959059},{"data":["148","31","100"],"timeStamp":11981.96000000462},{"data":["149","57","100"],"timeStamp":12012.55499990657},{"data":["132","33","0"],"timeStamp":12074.709999957122},{"data":["133","57","0"],"timeStamp":12147.409999975935},{"data":["149","60","100"],"timeStamp":12251.92499998957},{"data":["133","60","0"],"timeStamp":12418.574999901466},{"data":["149","59","100"],"timeStamp":12497.154999990016},{"data":["148","35","100"],"timeStamp":12517.460000002757},{"data":["132","31","0"],"timeStamp":12637.709999922663},{"data":["133","59","0"],"timeStamp":12647.859999909997},{"data":["149","57","100"],"timeStamp":12740.879999939352},{"data":["133","57","0"],"timeStamp":12877.154999994673},{"data":["149","60","100"],"timeStamp":12996.464999974705},{"data":["132","35","0"],"timeStamp":13038.409999920987},{"data":["133","60","0"],"timeStamp":13116.745000006631},{"data":["149","57","100"],"timeStamp":13235.744999954477},{"data":["148","31","100"],"timeStamp":13251.749999937601},{"data":["133","57","0"],"timeStamp":13418.469999916852},{"data":["149","60","100"],"timeStamp":13501.399999950081},{"data":["133","60","0"],"timeStamp":13657.84999995958},{"data":["149","59","100"],"timeStamp":13766.934999963269},{"data":["133","59","0"],"timeStamp":13897.499999962747},{"data":["149","57","100"],"timeStamp":14012.289999984205},{"data":["133","57","0"],"timeStamp":14146.959999925457},{"data":["149","60","100"],"timeStamp":14251.594999921508},{"data":["133","60","0"],"timeStamp":14418.364999932237},{"data":["149","59","100"],"timeStamp":14497.014999971725},{"data":["133","59","0"],"timeStamp":14647.735000005923},{"data":["149","57","100"],"timeStamp":14742.265000008047},{"data":["133","57","0"],"timeStamp":14876.87499995809},{"data":["148","33","100"],"timeStamp":14991.784999961965},{"data":["149","60","100"],"timeStamp":14995.980000006966},{"data":["132","31","0"],"timeStamp":15069.870000006631},{"data":["133","60","0"],"timeStamp":15116.33999994956},{"data":["149","57","100"],"timeStamp":15236.894999979995},{"data":["133","57","0"],"timeStamp":15418.189999996684},{"data":["149","60","100"],"timeStamp":15502.494999906048},{"data":["133","60","0"],"timeStamp":15657.579999999143},{"data":["149","59","100"],"timeStamp":15768.024999997579},{"data":["133","59","0"],"timeStamp":15897.054999950342},{"data":["149","57","100"],"timeStamp":16011.809999938123},{"data":["133","57","0"],"timeStamp":16148.294999962673},{"data":["149","60","100"],"timeStamp":16251.384999952279},{"data":["133","60","0"],"timeStamp":16418.189999996684},{"data":["148","36","100"],"timeStamp":16490.904999896884},{"data":["149","59","100"],"timeStamp":16496.55999999959},{"data":["132","33","0"],"timeStamp":16558.969999896362},{"data":["133","59","0"],"timeStamp":16647.31499995105},{"data":["149","57","100"],"timeStamp":16741.97999993339},{"data":["133","57","0"],"timeStamp":16876.60999991931},{"data":["149","60","100"],"timeStamp":16997.189999907278},{"data":["133","60","0"],"timeStamp":17116.240000003017},{"data":["149","57","100"],"timeStamp":17236.814999952912},{"data":["148","29","100"],"timeStamp":17240.98000000231},{"data":["132","36","0"],"timeStamp":17303.23999992106},{"data":["133","57","0"],"timeStamp":17418.079999973997},{"data":["149","60","100"],"timeStamp":17502.229999983683},{"data":["133","60","0"],"timeStamp":17657.464999938384},{"data":["149","59","100"],"timeStamp":17767.779999994673},{"data":["133","59","0"],"timeStamp":17896.77499991376},{"data":["149","57","100"],"timeStamp":18011.764999944717},{"data":["133","57","0"],"timeStamp":18147.844999912195},{"data":["149","60","100"],"timeStamp":18252.479999908246},{"data":["133","60","0"],"timeStamp":18417.909999960102},{"data":["149","59","100"],"timeStamp":18496.42999994103},{"data":["133","59","0"],"timeStamp":18647.04999991227},{"data":["149","57","100"],"timeStamp":18741.594999912195},{"data":["133","57","0"],"timeStamp":18876.45999994129},{"data":["149","60","100"],"timeStamp":18996.924999984913},{"data":["133","60","0"],"timeStamp":19115.764999995008},{"data":["149","57","100"],"timeStamp":19236.51499999687},{"data":["133","57","0"],"timeStamp":19417.719999910332},{"data":["148","33","100"],"timeStamp":19480.18499999307},{"data":["149","60","100"],"timeStamp":19501.9499999471},{"data":["132","29","0"],"timeStamp":19558.489999966696},{"data":["133","60","0"],"timeStamp":19658.654999919236},{"data":["149","59","100"],"timeStamp":19767.539999913424},{"data":["133","59","0"],"timeStamp":19897.909999941476},{"data":["148","31","100"],"timeStamp":19980.864999932237},{"data":["149","57","100"],"timeStamp":20012.939999927767},{"data":["132","33","0"],"timeStamp":20075.12999989558},{"data":["133","57","0"],"timeStamp":20147.51999999862},{"data":["149","60","100"],"timeStamp":20252.37499992363},{"data":["133","60","0"],"timeStamp":20417.499999981374},{"data":["149","59","100"],"timeStamp":20496.064999955706},{"data":["148","35","100"],"timeStamp":20517.729999963194},{"data":["132","31","0"],"timeStamp":20636.69499999378},{"data":["133","59","0"],"timeStamp":20646.734999958426},{"data":["149","57","100"],"timeStamp":20741.210000007413},{"data":["133","57","0"],"timeStamp":20876.239999895915},{"data":["149","60","100"],"timeStamp":20996.8349999981},{"data":["132","35","0"],"timeStamp":21038.78999990411},{"data":["133","60","0"],"timeStamp":21115.63999997452},{"data":["149","57","100"],"timeStamp":21236.054999986663},{"data":["148","31","100"],"timeStamp":21252.07499996759}]


class App extends React.Component {

  constructor(props){
    super(props)
    this.midiCollector = new BrowserMidiCollector()
    this.state = {
      midiInteracted: false,
      weGotMidi: false,
      showProjectManager: false, 

    }
    this.navigateToProjectManager = this.navigateToProjectManager.bind(this)
  }

  redigsterStartMidi(){
    document.onkeyup = (event) => { 
      if(event.key === "m" && this.state.midiInteracted === false){
        this.midiCollector.startMidi().then(() => {
          this.setState({midiInteracted: true})
        })
      }
      if(event.key === "Enter" && this.state.midiInteracted === true && this.determineAppState() === "SHOW_MAIN_APP") {
        this.setState({weGotMidi: true})
      }
    }
  }

  determineAppState(){
    if(this.state.showProjectManager === true){
      return "SHOW_PROJECT_MANAGER"
    }
    //only one possibility bound to this condition
    if(this.state.midiInteracted === false) {
      return "SHOW_PRESS_M"
    //midi interacted is true BUT we havent recorded anything yet.   
    } else if(!this.midiCollector.receivedAnyMessageYet) {
      return "SHOW_PLAY_MIDI"
    } else {
       return "SHOW_MAIN_APP"
    }
  }

  navigateToProjectManager(){
    this.setState({showProjectManager: true})
  }

  render(){
    let appState = this.determineAppState()

    if(appState === "SHOW_PROJECT_MANAGER") {

      return <ProjectManagerContainer midiCollector={this.midiCollector}/>

    }

    if (appState === "SHOW_MAIN_APP") {
      return (
        <VideoSelectorContainer videoSelectorGet={videoSelectorGet} rawMidi={midi} midiCollector={this.midiCollector} navigateToProjectManager={this.navigateToProjectManager} />
      )
    } else {
      //we'll only use this once so only register it when needed
      this.redigsterStartMidi()
      return (
        <Splash appState={appState} userMessage={this.midiCollector.userMessage}/>
      )
    }
  }

}

export default App;
