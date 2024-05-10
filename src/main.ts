import { Demo } from './game'
import { Preload } from './preload'
import { Game, Types } from 'phaser'

//  Find out more information about the Game Config at:
//  https://newdocs.phaser.io/docs/3.70.0/Phaser.Types.Core.GameConfig
const config: Types.Core.GameConfig = {
  type: Phaser.AUTO,
  width: window.innerWidth,
  height: window.innerHeight,
  backgroundColor: '#ffe8a3',
  parent: 'game-container',
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH
  },
  physics: {
    default: 'matter',
    matter: {
      //enableSleeping: true,
      gravity: {
        x: 0,
        y: 1
      }
      //debug: true
    }
  },
  scene: [Preload, Demo]
}

export default new Game(config)
