
async function getData() {
	// http://ocean.dmi.dk/tides/tides_dk.php
	// const res = await fetch("http://ocean.dmi.dk/tides/2021/Juelsminde.tmp.txt")
	const res = await fetch("/vandstand.txt")
	let data = (await res.text()).split("\n");
	data.splice(0, 15)
	data.pop();
	return data.map(elm => {
		const dateString = elm.substring(0, 12)
		const date = new Date(`${dateString.substring(0, 4)}-${dateString.substring(4, 6)}-${dateString.substring(6, 8)} ${dateString.substring(8, 10)}:${dateString.substring(10, 12)}`)
		const height = parseFloat(elm.substring(12, elm.length).trim())
		return { date, height };
	});
}

function getClosestIndex(data, date) {
	date = date.getTime();
	let closestDiff = Infinity;
	let closest = 0;
	for (let i = 0; i < data.length; i++) {
		const diff = Math.abs(data[i].date.getTime() - date)
		if (diff < closestDiff) {
			closestDiff = diff;
			closest = i;
		}
	}
	return closest;
}

function getLabels(data) {
	return data.map(elm => {
		return elm.date;
	})
}

function getValues(data) {
	return data.map(elm => {
		return elm.height;
	})
}

(async () => {

	const data = await getData();

	const closest = getClosestIndex(data, new Date())
	console.log(data[closest]);

	const smallData = data.slice(closest - 30, closest + 30).map(elm => ({ x: elm.date, y: elm.height }))
	console.log(smallData);


	let colorArray = [];
	colorArray[30] = "rgba(255, 0, 0, 0.9)"
	let sizeArray = [];
	sizeArray[30] = 5

	var ctx = document.getElementById('myChart').getContext('2d');
	var myChart = new Chart(ctx, {
		type: 'line',
		data: {
			datasets: [{
				label: 'cm over normal vandstand',
				data: smallData,
				pointBackgroundColor: colorArray,
				pointRadius: sizeArray,
				backgroundColor: "rgba(66, 135, 245, 0.7)",
				borderWidth: 1
			}]
		},
		options: {
			scales: {
				xAxes: [{
					type: 'time',
					time: {
						displayFormats: {
							quarter: 'MMM YYYY'
						}
					}
				}]
			},
		}
	});
})()

