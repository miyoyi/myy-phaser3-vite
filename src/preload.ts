import 'phaser'

const CDN = 'https://storage.360buyimg.com/web-static/hexigua'

export class Preload extends Phaser.Scene {
  constructor() {
    super('preload')
  }
  preload() {
    this.load.image('ground', CDN + '/ground.png')
    for (let i = 1; i <= 11; i++) {
      this.load.image(`${i}`, `${CDN}/${i}.png`)
    }
  }
  create() {
    this.scene.launch('demo')
  }
}
