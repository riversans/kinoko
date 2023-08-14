(function(){
    var _custom_title = Window_TitleCommand.prototype.makeCommandList
    Window_TitleCommand.prototype.makeCommandList = function() {
    _custom_title.call(this);
    this.addCommand('Exit',   'exit');
    };

    var _custom_sctitle = Scene_Title.prototype.createCommandWindow
    Scene_Title.prototype.createCommandWindow = function() {
        _custom_sctitle.call(this);
        this._commandWindow.setHandler('exit', this.commandExit.bind(this));
    };

    Scene_Title.prototype.commandExit = function() {
        SceneManager.terminate();
    };
    
   })();