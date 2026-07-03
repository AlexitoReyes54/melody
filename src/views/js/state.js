// TODO: implement js docs for the fn in this file
import { loopStore } from "./constants";

export const globalState = {

	// TODO: compare this 2 on each pressedKeys update
	currentLoopToPlay: [],
	pressedKeys: [],
	availableLoops: structuredClone(loopStore),

	// maybe i dont need to make any kind setter, it seems that is more useful if, 
	// there is some kind of side effect to execute

	streak: 0,

	increaseStreak() {
		this.streak++;
		const increaseStreak = new CustomEvent('increaseStreak', {
			detail: { value: this.streak }
		})
		window.dispatchEvent(increaseStreak);
	},

	nickName: '',

	setName(name) {
		// TODO: validate is type string
		if (name === undefined || name === '') {
			return false; // error
		}
		this.nickName = name;
	},

	// NOTE: to set this true again reset the state never do it manually 
	showWelcomeModal: true,
	showEndModal: false, // if this is true i have to reset the state of the game

	displayEndModala() {
		const showEndModalEvent = new CustomEvent('showEndModal', {
			detail: { showEndModal: this.showEndModal }
		})

		if (this.showEndModal) {
			this.showEndModal = true;
			window.dispatchEvent(showEndModalEvent);
			return;
		}
		window.dispatchEvent(showEndModalEvent);
	},

	displayWelcomeModala() {

		const showWelcomeModalEvent = new CustomEvent('showWelcomeModal', {
			detail: { showWelcomeModal: this.showWelcomeModal }
		})

		if (this.showWelcomeModal) {
			this.showWelcomeModal = false;
			window.dispatchEvent(showWelcomeModalEvent);
			return;
		}

		window.dispatchEvent(showWelcomeModalEvent);
	}

}

