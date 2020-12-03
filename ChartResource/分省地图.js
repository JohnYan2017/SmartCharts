//select cityname as title, value

//设置值范围
let minvalue=0;
let maxvalue=6000;

let dataset = __dataset__; //传入dataset

let title = dataset[0][0];
let series=[];
for (let i=1;i<dataset.length;i++){
 series.push({name:dataset[i][0],value:dataset[i][1]})
}
let houbei = 0;
for (i=1;i<dataset.length;i++){
 if(dataset[i][0]=='甘青宁'){
    series.push({name:'甘肃',value:dataset[i][1]/3});
    series.push({name:'青海',value:dataset[i][1]/3});
    series.push({name:'宁夏',value:dataset[i][1]/3});
 }
 else if(dataset[i][0]=='冀南' || dataset[i][0]=='冀北' ){
     houbei = houbei + dataset[i][1]
 }else{
 series.push({name:dataset[i][0],value:dataset[i][1]})
 }
}
if(houbei>0){
series.push({name:'河北',value:houbei})
}


option__name__ = {
//backgroundColor: '#6a7db5',
		title: {
			//text: '全国地图',
			//subtext: '纯属虚构',
			//x:'center'
		},
		tooltip : {
			trigger: 'item'
		},
        dataRange: {
					min : minvalue,
					max : maxvalue,
					calculable : true,
                    //orient : horizontal,
				//	color: ['#ff3333', 'orange', 'yellow','lime','aqua'],
					textStyle:{
					//	color:'#fff'
					} },

        series: [
            {
			name: title,
			type: 'map',
			mapType: 'china',
			roam: false,
			label: {
				normal: {
					show: true
				},
				emphasis: {
					show: false
				}
			},
			data:series
		}
        ]
    };
charts.push(myChart__name__);