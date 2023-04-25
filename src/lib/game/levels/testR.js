ig.module( 'game.levels.testR' )
.requires( 'impact.image','game.entities.player','game.entities.kill' )
.defines(function(){
LevelTestR=/*JSON[*/{
	"entities": [
		{
			"type": "EntityPlayer",
			"x": 66,
			"y": 160
		},
		{
			"type": "EntityKill",
			"x": 160,
			"y": 312,
			"settings": {
				"size": {
					"x": 32,
					"y": 16
				}
			}
		},
		{
			"type": "EntityKill",
			"x": 512,
			"y": 312,
			"settings": {
				"size": {
					"x": 64,
					"y": 16
				}
			}
		},
		{
			"type": "EntityKill",
			"x": 96,
			"y": 160
		}
	],
	"layer": [
		{
			"name": "background_",
			"width": 40,
			"height": 20,
			"linkWithCollision": false,
			"visible": 1,
			"tilesetName": "media/castle-tileset.png",
			"repeat": false,
			"preRender": false,
			"distance": "1",
			"tilesize": 16,
			"foreground": false,
			"data": [
				[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,63,0,0,0,0,0,0,0],
				[0,30,30,30,30,30,30,30,30,40,29,26,0,0,0,0,0,0,0,0,0,26,28,28,28,18,18,18,18,18,18,30,30,30,30,30,30,30,30,0],
				[0,89,30,30,89,30,30,89,30,48,27,25,28,0,0,0,0,0,0,0,26,26,29,29,28,30,58,58,58,58,30,30,30,30,30,30,30,30,30,0],
				[0,97,30,30,97,30,30,97,30,56,27,29,27,26,0,0,0,0,0,26,26,26,26,28,30,30,30,30,30,30,30,30,30,30,0,30,30,0,30,0],
				[0,30,30,30,30,30,30,30,30,27,28,26,25,26,27,0,0,0,25,26,26,27,30,30,30,30,30,30,30,30,30,30,30,0,0,0,0,0,0,0],
				[0,30,30,30,30,30,30,30,30,25,26,27,28,27,28,29,0,26,27,26,26,28,30,30,30,30,30,30,115,30,30,30,30,0,0,0,0,0,0,30],
				[0,0,1,0,0,26,27,26,27,27,27,86,29,28,25,26,26,25,26,26,27,27,30,30,30,40,30,30,30,30,30,30,30,0,0,0,0,0,0,30],
				[0,25,26,27,28,25,26,27,26,26,25,30,25,29,28,0,26,27,0,28,28,25,25,30,25,48,30,89,30,30,30,89,30,0,0,0,0,0,0,0],
				[0,25,89,27,89,25,89,26,25,0,28,30,30,30,1,0,0,0,0,0,1,30,30,30,30,48,30,30,30,89,30,30,26,26,27,28,26,26,27,28],
				[0,0,97,26,97,26,97,28,0,0,27,30,30,30,30,30,30,30,30,0,30,30,30,30,30,48,30,89,30,30,30,89,26,26,29,29,26,26,27,28],
				[0,28,27,25,28,27,25,0,0,0,0,30,30,30,30,30,89,30,89,30,30,30,30,30,30,56,30,30,30,30,30,30,27,25,27,28,29,29,25,0],
				[0,30,30,30,63,63,63,0,0,0,0,30,30,30,30,30,97,30,97,30,30,30,30,30,30,26,26,25,25,1,25,25,27,26,27,28,26,27,27,26],
				[0,30,30,30,26,26,27,27,28,26,27,28,30,0,86,30,30,30,30,30,0,0,30,30,30,26,26,26,26,26,28,28,29,25,26,27,27,28,29,27],
				[0,0,30,30,25,25,89,27,89,27,27,27,0,0,0,30,30,0,30,30,0,0,30,30,30,26,89,28,89,0,27,89,26,25,25,0,0,1,0,0],
				[0,30,30,30,25,26,97,27,97,27,25,0,0,0,0,0,0,0,0,0,0,0,0,25,26,25,97,27,97,29,27,97,30,30,30,30,30,30,30,0],
				[0,30,30,30,25,25,26,27,28,0,0,0,0,0,30,30,30,30,30,0,0,30,30,25,26,27,28,26,0,63,110,64,30,30,30,30,30,30,30,0],
				[0,30,30,30,25,0,0,0,26,27,30,30,30,30,30,30,30,30,30,0,0,30,30,27,28,28,27,0,0,0,30,30,30,0,0,30,30,30,30,0],
				[0,0,0,0,0,0,0,0,0,64,30,30,30,30,0,30,30,30,30,30,30,30,30,27,0,28,0,0,0,0,30,30,30,0,0,30,30,30,30,0],
				[0,0,30,30,0,0,0,0,0,48,30,30,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,30,30,30,30,0,0,0,0],
				[0,0,0,30,0,0,0,0,0,56,30,30,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,30,30,30,30,30,0,0,0,0]
			]
		},
		{
			"name": "main",
			"width": 40,
			"height": 20,
			"linkWithCollision": false,
			"visible": 1,
			"tilesetName": "media/castle-tileset.png",
			"repeat": false,
			"preRender": false,
			"distance": "1",
			"tilesize": 16,
			"foreground": false,
			"data": [
				[62,63,63,63,63,63,63,63,63,63,63,63,63,63,63,63,63,63,63,63,63,63,63,63,63,63,63,63,63,63,63,63,8,62,63,63,63,63,63,40],
				[40,107,107,107,107,107,107,107,107,107,107,107,17,17,17,17,17,17,17,17,17,0,126,126,126,126,126,126,126,126,126,0,16,0,0,0,0,0,0,48],
				[48,107,107,107,107,107,107,107,107,107,107,107,107,17,17,17,17,17,17,17,0,126,126,126,126,126,126,126,126,126,126,126,16,0,78,0,0,78,0,48],
				[48,107,107,107,107,107,107,107,107,107,107,107,107,107,17,17,17,17,17,0,0,0,0,0,0,0,0,0,0,0,0,0,16,0,86,31,32,86,0,48],
				[48,107,107,107,107,107,107,107,107,107,107,107,107,107,107,17,17,17,0,0,0,0,0,0,0,0,0,0,75,0,0,0,16,9,9,9,9,9,9,56],
				[56,69,37,39,70,0,107,107,107,107,107,78,107,107,107,107,17,0,0,0,0,0,0,0,0,0,0,0,83,0,0,0,16,41,42,43,44,45,46,47],
				[17,17,8,17,17,67,67,107,107,107,107,86,0,0,0,78,0,0,78,0,0,0,0,0,0,0,100,67,67,67,67,67,0,49,50,51,52,53,54,55],
				[40,72,16,127,0,0,0,107,107,107,67,7,67,0,0,86,0,0,86,0,0,0,67,7,67,0,100,100,100,100,100,100,0,62,63,63,63,63,63,64],
				[48,0,16,127,0,0,0,107,107,59,107,15,0,0,57,17,17,17,58,58,57,0,0,15,0,0,0,100,100,100,100,100,0,0,0,0,7,0,0,71],
				[48,58,16,127,127,0,0,110,59,59,107,23,0,0,57,72,100,100,100,58,57,0,0,23,0,0,0,100,100,78,100,100,0,0,0,0,15,0,0,0],
				[48,0,16,0,0,0,0,58,58,59,59,107,107,107,65,100,100,100,100,100,57,0,0,0,0,0,0,100,100,86,100,100,0,0,0,0,23,0,0,58],
				[48,0,16,0,57,63,63,63,63,63,64,107,107,107,65,100,100,100,100,100,57,0,0,0,0,0,0,67,67,65,67,67,0,0,0,0,0,0,0,0],
				[48,114,16,114,57,72,107,107,107,107,107,107,107,10,10,100,100,75,100,100,20,20,0,0,0,0,0,0,0,65,0,0,0,0,0,0,0,69,61,70],
				[48,58,114,114,57,107,107,107,107,107,107,107,10,10,10,59,100,83,100,59,20,20,0,0,0,0,0,0,0,65,0,0,0,67,67,2,2,8,63,64],
				[48,114,107,107,57,107,107,107,107,107,107,10,10,10,62,63,63,63,63,64,62,63,64,0,0,0,0,0,119,65,119,0,0,0,0,0,93,16,71,40],
				[48,73,107,75,65,107,58,78,100,10,10,10,10,10,100,100,100,100,100,12,12,0,0,0,0,0,0,0,62,63,63,8,0,0,0,0,0,16,0,48],
				[56,81,107,83,65,58,58,86,100,100,100,100,100,0,78,100,100,78,100,12,12,0,0,0,80,0,0,17,17,17,73,16,0,10,10,0,0,16,0,48],
				[62,63,63,63,63,63,63,63,63,57,100,100,100,100,86,100,100,86,100,67,67,0,0,0,88,0,17,17,17,17,81,16,0,10,10,0,106,106,0,56],
				[41,42,43,44,45,46,41,42,43,65,100,100,62,63,63,63,63,63,63,63,63,63,63,63,63,63,63,63,63,63,63,64,101,101,98,98,62,63,63,64],
				[49,50,51,52,53,54,49,50,51,65,100,100,41,42,41,42,45,43,45,41,42,43,44,45,46,41,42,43,44,45,46,47,101,101,101,101,41,42,43,44]
			]
		},
		{
			"name": "collision",
			"width": 40,
			"height": 20,
			"linkWithCollision": false,
			"visible": 1,
			"tilesetName": "",
			"repeat": false,
			"preRender": false,
			"distance": 1,
			"tilesize": 16,
			"foreground": false,
			"data": [
				[1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
				[1,0,0,0,0,0,0,0,0,0,0,0,1,1,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,12,0,0,0,0,0,0,1],
				[1,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,12,0,0,0,0,0,0,1],
				[1,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,12,0,0,0,0,0,0,1],
				[1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,12,1,1,1,1,1,1,1],
				[1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,12,1,0,0,0,0,0,0],
				[1,1,12,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,12,12,12,12,12,0,1,0,0,0,0,0,0],
				[1,0,12,0,0,0,0,0,0,0,12,12,12,0,0,0,0,0,0,0,0,0,12,12,12,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0],
				[1,0,12,0,0,0,0,0,0,1,0,0,0,0,12,1,1,1,1,1,12,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
				[1,1,12,0,0,0,0,0,1,1,0,0,0,0,12,0,0,0,0,0,12,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
				[1,0,12,0,0,0,0,1,0,0,1,0,0,0,12,0,0,0,0,0,12,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
				[1,0,12,0,12,1,1,0,0,0,0,0,0,0,12,0,0,0,0,0,12,0,0,0,0,0,0,12,12,12,12,12,0,0,0,0,0,0,0,1],
				[1,0,12,0,12,0,0,0,0,0,0,0,0,1,1,0,0,0,0,0,1,1,0,0,0,0,0,0,0,12,0,0,0,0,0,0,0,0,0,1],
				[1,1,0,0,12,0,0,0,0,0,0,0,1,0,0,1,0,0,0,1,1,1,0,0,0,0,0,0,0,12,0,0,0,12,12,1,1,12,1,1],
				[1,0,0,0,12,0,0,0,0,0,0,1,1,1,0,1,1,1,1,1,1,1,1,0,0,0,0,0,0,12,0,0,0,0,0,0,0,12,0,1],
				[1,1,0,0,12,0,1,0,0,1,1,1,1,1,0,0,0,0,0,1,1,0,0,0,0,0,0,0,1,1,1,12,0,0,0,0,0,12,0,1],
				[1,1,0,0,12,1,1,0,0,0,0,0,0,0,0,0,0,0,0,1,1,0,0,0,0,0,0,1,0,1,1,12,0,1,1,0,0,12,0,1],
				[1,1,1,1,1,1,1,1,1,12,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,1,1,12,0,1,1,0,0,12,0,1],
				[0,0,0,0,0,0,0,0,0,12,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,0,0,1,1,1,1],
				[0,0,0,0,0,0,0,0,0,12,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0]
			]
		}
	]
}/*]JSON*/;
LevelTestRResources=[new ig.Image('media/castle-tileset.png'), new ig.Image('media/castle-tileset.png')];
});