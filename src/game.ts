import 'phaser'

export class Demo extends Phaser.Scene {
  private enableAdd: boolean = true
  constructor() {
    super('demo')
  }

  create() {
    //设置边界
    this.matter.world.setBounds()
    //添加地面
    const groundSprite = this.add.tileSprite(
      window.innerWidth / 2,
      window.innerHeight - 50 / 2,
      window.innerWidth,
      50,
      'ground'
    )
    this.matter.add.gameObject(groundSprite, { isStatic: true })

    const x = window.innerWidth / 2
    const y = window.innerHeight / 10
    let fruit = this.createFruit(x, y)
    this.input.on('pointermove', (pointer: { x: number | undefined }) => {
      fruit.setPosition(pointer.x, y);
    });
    this.input.on('pointerup', (point: { x: any }) => {
      if (this.enableAdd) {
        this.enableAdd = false
        //先x轴上移动到手指按下的点
        this.tweens.add({
          targets: fruit,
          x: point.x,
          duration: 100,
          ease: 'Power1',
          onComplete: () => {
            const body = fruit?.body as any
            this.createFruit(point.x, y, false, body.label)
            fruit.destroy()
            setTimeout(() => {
              fruit = this.createFruit(x, y)
            }, 1000)
            // 播完动画才能点击
            setTimeout(() => {
              this.enableAdd = true
            }, 1300)
          }
        })
      }
    })
    this.matter.world.on(
      'collisionstart',
      (_event: any, bodyA: any, bodyB: any) => {
        const unfinished = bodyA.label !== '11'
        const same = bodyA.label === bodyB.label
        const live = !bodyA.isStatic && !bodyB.isStatic
        if (unfinished && same && live) {
          // 不加静态会把合成的弹飞
          bodyA.isStatic = true
          bodyB.isStatic = true
          const { x, y } = bodyA.position
          const label = parseInt(bodyA.label) + 1
          this.tweens.add({
            targets: bodyB.position,
            props: {
              x: { value: x, ease: 'Power3' },
              y: { value: y, ease: 'Power3' }
            },
            duration: 100,
            onComplete: () => {
              bodyA.gameObject.alpha = 0
              bodyB.gameObject.alpha = 0
              bodyB.destroy()
              bodyA.destroy()
              this.createFruit(x, y, false, `${label}`)
            }
          })
        }
      }
    )
    const endLineSprite = this.add.tileSprite(
      window.innerWidth / 2,
      y + window.devicePixelRatio * 5,
      window.innerWidth,
      8,
      'endLine'
    )
    //设为隐藏
    endLineSprite.setVisible(false)
    this.matter.add.gameObject(endLineSprite, {
      isStatic: true,
      //传感器模式，可以检测到碰撞，但是不会对物体产品效果
      isSensor: true,
      onCollideCallback: () => {
        if (this.enableAdd) {
          const gameOver = this.add.text(512, 384, 'Game Over', {
            fontFamily: 'Arial Black',
            fontSize: window.devicePixelRatio * 10,
            color: '#ffffff',
            stroke: '#000000',
            strokeThickness: 5,
            align: 'center'
          })
          gameOver.setOrigin(0.5)
          this.input.once('pointerdown', () => {
            location.reload()
          })
        }
      }
    })
  }

  createFruit(x: number, y: number, isStatic = true, key?: string) {
    key = key || `${Phaser.Math.Between(1, 5)}`
    const fruit = this.matter.add.image(x, y, key)
    fruit.setBody(
      {
        type: 'circle',
        radius: fruit.width / 2
      },
      {
        isStatic,
        label: key
      }
    )
    fruit.setBounce(0.2)
    this.tweens.add({
      targets: fruit,
      scaleX: 0.75,
      scaleY: 0.75,
      ease: 'Back',
      duration: 300
    })
    return fruit
  }
}
