var data=__dataset__;
var table = '<table class="table">';//如果不要换行用table-responsive
var option__name__ ='';

//<tr class="success">,"error","warning","info"
//头部, 不需要可以去掉
table += "<thead><tr>";
for(var j=0; j<data[0].length;j++){
  table = table + "<td>" + data[0][j] + "</td>";
};
table += "</thead></tr>";

//表主体, 如果有头部, 把0改为1
table += "<tbody>";
 for(var i=1;i<data.length;i++){
 if(i%2==0){
  table += "<tr>";}
 else{table += "<tr class='info'>"};
  for (var j=0; j<data[i].length;j++){
   table = table + "<td>" + data[i][j] + "</td>";
  };
  table += "</tr>";
 };
 table += "</tbody></table>";

dom__name__.innerHTML=table;