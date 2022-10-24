class BrakeBanner{
	constructor(selector){
		this.app = new PIXI.Application({
			width: window.innerWidth,
			height: window.innerHeight,
			backgroundColor: 0x061639,
			resizeTo: window
		})

		document.querySelector(selector).appendChild(this.app.view)

		this.loader = new PIXI.Loader()
		this.stage = this.app.stage

		this.resources = this.loader.resources

		this.loader.add("btn.png", "images/btn.png")
		this.loader.add("brake_bike.png", "images/brake_bike.png")
		this.loader.add("brake_handlerbar.png", "images/brake_handlerbar.png")
		this.loader.add("brake_lever.png", "images/brake_lever.png")
		this.loader.add("btn_circle.png", "images/btn_circle.png")

		this.loader.load()

		this.loader.onComplete.add(() => {
			this.show()
		})
	}

	show() {
		const backgroundAction = this.createBackground()
		const bikeContainer = this.createBike()

		this.createActionButton({
			pause: [
				backgroundAction.pause,
				bikeContainer.pause
			],
			start: [
				backgroundAction.start,
				bikeContainer.start,
			]
		})
	}

	createBike() {
		// 创建自行车的容器
		const bikeContainer = new PIXI.Container()
		this.stage.addChild(bikeContainer)

		// 自行车骨架
		const bikeImage = new PIXI.Sprite(this.resources['brake_bike.png'].texture)
		bikeContainer.addChild(bikeImage)


		// 刹车握把
		const brakeLeverImage = new PIXI.Sprite(this.resources['brake_lever.png'].texture)
		bikeContainer.addChild(brakeLeverImage)

		brakeLeverImage.pivot.x = 455
		brakeLeverImage.pivot.y = 455

		brakeLeverImage.x = 722
		brakeLeverImage.y = 900

		// 自行车支架
		const brakeHandlerbarImage = new PIXI.Sprite(this.resources['brake_handlerbar.png'].texture)
		bikeContainer.addChild(brakeHandlerbarImage)


		bikeContainer.scale.x = bikeContainer.scale.y = 0.3

		const resize = () => {
			bikeContainer.x = window.innerWidth - bikeContainer.width
			bikeContainer.y = window.innerHeight - bikeContainer.height
		}
		window.addEventListener('resize', resize)
		resize()

		function pause() {
			gsap.to(brakeLeverImage, {duration: .4, rotation: Math.PI/180*-30})
			gsap.to(bikeContainer, {duration: .2, y: bikeContainer.y + 6, ease: 'linear'})
			gsap.to(bikeContainer, {duration: .1, y: bikeContainer.y, ease: 'linear', delay: .2})

		}

		function start() {
			gsap.to(brakeLeverImage, {duration: .2, rotation: 0})
		}

		return {
			pause,
			start
		}
	}

	createActionButton(action) {
		let actionButton = new PIXI.Container()

		this.stage.addChild(actionButton)

		actionButton.x = actionButton.y = 300

		actionButton.interactive = true
		actionButton.buttonMode = true


		let btnImage = new PIXI.Sprite(this.resources['btn.png'].texture)

		let btnCircle = new PIXI.Sprite(this.resources['btn_circle.png'].texture)

		actionButton.addChild(btnCircle)
		actionButton.addChild(btnImage)

		btnImage.pivot.x = btnImage.pivot.y = btnImage.width / 2
		btnCircle.pivot.x = btnCircle.pivot.y = btnCircle.width / 2

		btnCircle.scale.x = btnCircle.scale.y = 0.8
		gsap.to(btnCircle.scale, {duration:1, x: 1.1, y: 1.1, repeat: -1})
		gsap.to(btnCircle, {duration:1, alpha: 0, repeat: -1})

		actionButton.on('mousedown', () => {
			action.pause.forEach(item => item())
		})

		actionButton.on('mouseup', () => {
			action.start.forEach(item => item())
		})

		return actionButton
	}
	createBackground() {
		const particleContainer = new PIXI.Container()
		this.stage.addChild(particleContainer)

		particleContainer.pivot.x = window.innerWidth/2
		particleContainer.pivot.y = window.innerHeight/2

		particleContainer.x = window.innerWidth/2
		particleContainer.y = window.innerHeight/2

		particleContainer.rotation = Math.PI/180*35

		let particles = []
		const colors = [0x9966FF, 0x9455f1, 0xf233a4, 0x336699, 0xff7904]

		for (let i = 0; i < 20; i++) {
			let gr = new PIXI.Graphics()
			gr.beginFill(colors[Math.floor(Math.random()*colors.length)])
			gr.drawCircle(0,0,4)
			gr.endFill()

			let pItem = {
				sx: Math.random()*window.innerWidth,
				sy: Math.random()*window.innerHeight,
				gr: gr
			}

			gr.x = pItem.sx
			gr.y = pItem.sy

			particleContainer.addChild(gr)

			particles.push(pItem)
		}

		let speed = 0
		function loop() {
			speed += .5
			speed = Math.min(speed, 30)
			for(let i = 0; i < particles.length; i++) {
				let pItem = particles[i]

				pItem.gr.y += speed

				if (speed >= 20) {
					pItem.gr.scale.y = 20
					pItem.gr.scale.x = .05
				}

				if (pItem.gr.y > window.innerHeight) {
					pItem.gr.y = 0
				}
			}
		}

		gsap.ticker.add(loop)

		function start() {
			speed = 0
			gsap.ticker.add(loop)

		}

		function pause() {
			gsap.ticker.remove(loop)

			for(let i = 0; i < particles.length; i++) {
				let pItem = particles[i]

				pItem.gr.scale.y = 1
				pItem.gr.scale.x = 1

				gsap.to(pItem.gr, {duration: .3, x: pItem.sx, y: pItem.sy, ease: 'elastic.out'})
			}
		}

		return {
			start,
			pause
		}
	}
}