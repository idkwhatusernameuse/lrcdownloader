const readline = require('readline')
const fetch = require('node-fetch')
const fs = require('fs')

const searchAPI = 'https://music.linkorg.club/search?keywords='
const lyricsAPI = 'https://music.linkorg.club/lyric?id='

const rl = readline.createInterface({
	input: process.stdin,
	output: process.stdout
})

function search(text) {
	fetch(searchAPI + text)
		.then(res => res.json())
		.then(body => {
			if (body.result.songCount != 0) {
				let results = []
				for (let i = 0; i < body.result.songs.length; i++) {
					let song = body.result.songs[i]
					let artistandsong = song.artists[0].name + ' - ' + song.name
					results.push({
						id: song.id,
						text: artistandsong
					})
					console.log((i + 1) + ': ' + artistandsong)
				}
				rl.question('Select a song (0 = cancel): ', (id) => {
					if (id > 0 && id <= 30) {
						queryLyrics(results[id - 1].id)
					} else {
						console.error('Invalid input.')
					}
					rl.close()
				})
			} else {
				console.error('No results')
			}
		})
		.catch(err => console.error(err))
}

function queryLyrics(id) {
	fetch(lyricsAPI + id) 
		.then(res => res.json())
		.then(body => {
			if (body.lrc.lyric != undefined) {
				let lrc = body.lrc.lyric
				fs.writeFileSync('./' + id + '.lrc', lrc)
				console.log('Saved ' + id + '.lrc')
			} else {
				console.error('There are no lyrics for this song...')
			}		
		})
		.catch(err => console.error(err))
}

rl.question('Search...: ', function(text) {
	search(text)
})
