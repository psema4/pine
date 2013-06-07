window.Game = {
    splash: { deck: ['splash.png'], prefix: 'assets/', delay: 3000 }

  , ctx: ''

  , run: function() {
        console.log('test game #2 running');

        var ctx = Game.scope.setup();
        Game.ctx = ctx;

        ctx.fillStyle = 'rgb(255,255,255)';
        ctx.fillRect(0,0,640,480);

        ctx.fillStyle = 'rgb(0,0,200)';
        ctx.fillRect(10,10,620,460);

        setTimeout(function() {
            Game.animate();
            Game.scope.splash({ deck: ['splash.png'], prefix: Game.splash.prefix , delay: 150 });
        }, 3000);
    }

  , animate: function() {
        var ctx = this.ctx;
        console.log('this.ctx:', ctx);
    }
}
