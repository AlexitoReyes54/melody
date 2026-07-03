export const KeyToPitch = {
	"do": "C4",
	"do-sharp": "C#4",
	"re": "D4",
	"re-sharp": "D#4",
	"mi": "E4",
	"fa": "F4",
	"fa-sharp": "F#4",
	"sol": "G4",
	"sol-sharp": "G#4",
	"la": "A4",
	"la-sharp": "A#4",
	"si": "B4"
};

export const loopStore = [
	{
		key: 1,
		loop: ["do", "re", "mi", "fa", "sol"],
	},
	{
		key: 2,
		loop: ["do", "mi", "sol", "si"],
	},
	{
		key: 3,
		loop: ["do", "do-sharp", "re", "re-sharp", "mi"],
	},
	{
		key: 4,
		loop: ["fa", "fa-sharp", "sol", "sol-sharp"],
	},
	{
		key: 5,
		loop: ["la", "si", "sol", "mi", "do"],
	}
];
