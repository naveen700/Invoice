

//Used to convert Number into Inwords Format
function inWords (num) {
    var a = ['','One ','Two ','Three ','Four ', 'Five ','Six ','Seven ','Eight ','Nine ','Ten ','Eleven ','Twelve ','thirteen ','fourteen ','fifteen ','sixteen ','seventeen ','eighteen ','nineteen '];
    var b = ['', '', 'Twenty','Thirty','Forty','Fifty', 'Sixty','Seventy','Eighty','Ninety'];
    if ((num = num.toString()).length > 9) return 'overflow';
    n = ('000000000' + num).substr(-9).match(/^(\d{2})(\d{2})(\d{2})(\d{1})(\d{2})$/);
    if (!n) return; var str = '';
    str += (n[1] != 0) ? (a[Number(n[1])] || b[n[1][0]] + ' ' + a[n[1][1]]) + 'Crore ' : '';
    str += (n[2] != 0) ? (a[Number(n[2])] || b[n[2][0]] + ' ' + a[n[2][1]]) + 'Lakh ' : '';
    str += (n[3] != 0) ? (a[Number(n[3])] || b[n[3][0]] + ' ' + a[n[3][1]]) + 'Thousand ' : '';
    str += (n[4] != 0) ? (a[Number(n[4])] || b[n[4][0]] + ' ' + a[n[4][1]]) + 'Hundred ' : '';
    str += (n[5] != 0) ? ((str != '') ? 'and ' : '') + (a[Number(n[5])] || b[n[5][0]] + ' ' + a[n[5][1]]) + 'Only ' : '';
    return str;
}


//This is used to round the number at 2 decimal format
function roundNumber(number,decimals) {
  var newString;// The new rounded number
  decimals = Number(decimals);
  if (decimals < 1) {
    newString = (Math.round(number)).toString();
  } else {
    var numString = number.toString();
    if (numString.lastIndexOf(".") == -1) {// If there is no decimal point
      numString += ".";// give it one at the end
    }
    var cutoff = numString.lastIndexOf(".") + decimals;// The point at which to truncate the number
    var d1 = Number(numString.substring(cutoff,cutoff+1));// The value of the last decimal place that we'll end up with
    var d2 = Number(numString.substring(cutoff+1,cutoff+2));// The next decimal, after the last one we want
    if (d2 >= 5) {// Do we need to round up at all? If not, the string will just be truncated
      if (d1 == 9 && cutoff > 0) {// If the last digit is 9, find a new cutoff point
        while (cutoff > 0 && (d1 == 9 || isNaN(d1))) {
          if (d1 != ".") {
            cutoff -= 1;
            d1 = Number(numString.substring(cutoff,cutoff+1));
          } else {
            cutoff -= 1;
          }
        }
      }
      d1 += 1;
    } 
    if (d1 == 10) {
      numString = numString.substring(0, numString.lastIndexOf("."));
      var roundedNum = Number(numString) + 1;
      newString = roundedNum.toString() + '.';
    } else {
      newString = numString.substring(0,cutoff) + d1.toString();
    }
  }
  if (newString.lastIndexOf(".") == -1) {// Do this again, to the new string
    newString += ".";
  }
  var decs = (newString.substring(newString.lastIndexOf(".")+1)).length;
  for(var i=0;i<decimals-decs;i++) newString += "0";
  //var newNumber = Number(newString);// make it a number if you like
  return newString; // Output the result to the form field (change for your purposes)
}

//It is update total for this System
function update_total() {
    var total = 0;
    $('.price').each(function(i){
    price = $(this).html().replace("$","");
    if (!isNaN(price)) total += Number(price);
    });
    total = Math.round(total);
    $('#subtotal').html(""+total);
    update_balance();
    update_Cgst();
    update_Sgst();
    update_Igst();

}
//for used for the freight Charges
function update_balance(){
  var sum = parseInt($("#subtotal").html().replace("$",""));
    var per =   parseInt($("#paid").val());
    var with_freight_charges =Math.round(sum+per);
    $('#total').html(""+with_freight_charges);
    $('#subtotal').html(""+with_freight_charges);
    $('#total_words').html(""+inWords(with_freight_charges));
}

//It is used to update CGST
function update_Cgst()
{var cgst,n;
 var sum = $("#subtotal").html().replace("$","") 
 var s = $("#total").html().replace("$","");
 var per =    $("#cgst").val().replace("%","");
    cgst = (per/100)*sum;
    n= Math.round(parseFloat(s)+parseFloat(cgst));
  $('.cgst').html(""+cgst);
  $('#total').html(""+n);
}


//It is used to update SGST
function update_Sgst()
{
    var sgst,n;
    var sum = $("#subtotal").html().replace("$","")
    var s = $("#total").html().replace("$","");
    var per =    $("#sgst").val().replace("%","");
    sgst = (per/100)*sum;
    n= Math.round(parseFloat(s)+parseFloat(sgst));
    sgst = roundNumber(sgst,2);
    $('.sgst').html(""+sgst);
    $('#total').html(""+n);
    $('#total_words').html(""+inWords(n));
}
//It is used to update IGST
function update_Igst()
{
    var igst,n;
    var sum = $("#subtotal").html().replace("$","")
    var s = $("#total").html().replace("$","");
    var per =    $("#igst").val().replace("%","");
    igst = (per/100)*sum;
    n= Math.round(parseFloat(s)+parseFloat(igst));
    igst = roundNumber(igst,2);
    $('.igst').html(""+igst);
    $('#total').html(""+n);
    $('#total_words').html(""+inWords(n));

}
//This is used to update row at each item from table
function update_price() {
  var row = $(this).parents('.item-row');
  var price = row.find('.cost').val().replace("s","") * row.find('.qty').val();
  price = roundNumber(price,2);
  var discount = Math.round( (row.find('.discount_new').val()/100)*price);
  price = price-discount;
  isNaN(price) ? row.find('.price').html("N/A") : row.find('.price').html(""+price);
  row.find(".after_discount").html(discount);
  update_total();
}

//Selection onclick/Binding to provide event handling
function bind() {
  $(".cost").blur(update_price);
  $(".qty").blur(update_price);
  $(".discount_new").blur(update_price);
}

var a;
//Javasscript starts from Starts with.........
$(document).ready(function() {
  $('input').click(function(){
    $(this).select();
  });

  $("#paid").blur(update_balance);
  $("#cgst").blur(update_Cgst);
  $("#sgst").blur(update_Sgst);
  $("#igst").blur(update_Igst);

  a=$(".item-row:last>td:first").html();
  $("#addrow").click(function(){
      ++a;
      
      $(".item-row:last").after('<tr class="item-row"><td>'+a+'</td><td class="item-name" contentEditable><b><div class="delete-wpr"><br><a class="delete" href="javascript:;" title="Remove row">-</a></div></b></td><td class="description" contentEditable></td><td><textarea class="cost">0</textarea></td><td><textarea class="qty">0</textarea></td><td><textarea class="discount_new">1</textarea></td><td class="after_discount"></td></td> <td><span class="price">0</span></td></tr>');
    if ($(".delete").length > 0)
        $(".delete").show();
    bind();
  });
  bind();
  $(".delete").live('click',function(){
    $(this).parents('.item-row').remove();
    update_total();
    if ($(".delete").length < 2) $(".delete").hide();
  --a;
  });
});