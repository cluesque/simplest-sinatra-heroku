var pusherKey     = '449985a46708136f3d74';
var pusherStream  = 'indigo_production';

var BigNumber = {
  defined: function(variable) { return typeof variable !== 'undefined';},
  readAsCents: function(value) {
    if(typeof(value) == 'string') {
      value = parseFloat("0"+value.replace(/[$,]/g,''));
    }
    return value*100;
  },
  commify: function(num) {
    return num.toString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,");
  },
  currentAmount: function() {
    return BigNumber.element.data('amount');
  },
  displayedAmount: function() {
    return parseInt(BigNumber.readAsCents(BigNumber.element.text()));
  },
  skew: function() {
    return BigNumber.currentAmount() - BigNumber.displayedAmount();
  },
  init: function(element) {
    BigNumber.element = element;
    BigNumber.element.data('amount', BigNumber.displayedAmount());
    new Pusher(pusherKey).subscribe(pusherStream).bind('new_contribution', BigNumber.update);
  },
  update: function(data) {
    var total;
    if(data.sitewide_total > BigNumber.currentAmount()) {
      total = data.sitewide_total+data.amount;
    } else {
      total = BigNumber.currentAmount()+data.amount;
    }

    BigNumber.element.data('amount', total);
    return BigNumber.startAnimation();
  },
  startAnimation: function() {
    if(!BigNumber.defined(BigNumber.intervalId) || BigNumber.intervalId == null) {
      BigNumber.intervalId = setInterval(BigNumber.animate, 500);
    }
    return BigNumber;
  },
  stopAnimation: function() {
    clearInterval(BigNumber.intervalId);
    BigNumber.intervalId = null;
    return BigNumber;
  },
  animate: function() {
    if (BigNumber.displayedAmount() >= BigNumber.currentAmount()) {
      BigNumber.stopAnimation();
    } else {
      var rate = 1, diff = BigNumber.skew()/100;
      // and now, an arbitrary fn that accelerates the rate of change
      // if the displayed number falls $1,000s behind
      if(diff > 200) { rate = (diff/50)*(Math.ceil(diff/10000)); }
      var newTotal = BigNumber.displayedAmount()/100 + rate;
      if(newTotal*100 > BigNumber.currentAmount()) {
        newTotal = BigNumber.currentAmount()/100;
      }
      BigNumber.element.text(BigNumber.commify(parseInt(newTotal)));
    }
  }
};