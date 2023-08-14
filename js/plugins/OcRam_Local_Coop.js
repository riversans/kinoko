//-----------------------------------------------------------------------------
// OcRam plugins - OcRam_Core.js        (will be embedded in all of my plugins)
//=============================================================================
/* DO NOT COPY, RESELL OR CLAIM ANY PIECE OF THIS SOFTWARE AS YOUR OWN!     *
 * Copyright(c) 2020, Marko Paakkunainen // mmp_81 (at) hotmail.com         */
"use strict"; var ShaderTilemap = ShaderTilemap || false; var Imported = Imported || {}; var Yanfly = Yanfly || {}; // In case there's no Yanfly plugins in use
if (!Imported.OcRam_Core) { // OcRam_Core has only the functionality which are used widely in all OcRam plugins...
    Game_Interpreter.prototype.event = function () { /* Get Game_Event in event editor like: this.event(); */ return ($gameMap) ? $gameMap.event(this._eventId) : null; };
    Game_Map.prototype.getEventsByName = function (event_name) { /* Get Game_Map events by name */ return this._events.filter(function (ev) { return ev.event().name == event_name; }); };
    Game_Event.prototype.getComments = function () { /* Returns all comments + commandIndex from Game_Event as Array */ if (this._erased || this._pageIndex < 0) return []; var comments = []; var i = 0; this.list().forEach(function (p) { if (p.code == 108) { p.commandIndex = i; comments.push(p); } i++; }); return comments; };
    Game_Event.prototype.getStringComments = function () { /* Returns all comments from Game_Event as String Array */ if (this._erased || this._pageIndex < 0) return []; var comments = []; this.list().filter(function (c) { return c.code == 108; }).forEach(function (p) { p.parameters.forEach(function (s) { comments.push(s); }); }); return comments; };
    ImageManager.loadOcRamBitmap = function (filename, hue) {  /* Load bitmap from ./img/ocram folder */ return this.loadBitmap('img/ocram/', filename, hue, false); };
    Imported.OcRam_Core = true; var OcRam_Core = OcRam_Core || function () { /* OcRam core class */ this.initialize.apply(this, arguments); };
    OcRam_Core.prototype.initialize = function () { /* Initialize OcRam core */ this.name = "OcRam_Core"; this.version = "1.05"; this.twh = [48, 48]; this.twh50 = [24, 24]; this.radian = Math.PI / 180; this._isIndoors = false; this._screenTWidth = Graphics.width / 48; this._screenTHeight = Graphics.height / 48; this.plugins = []; this._menuCalled = false; this.Scene_Map_callMenu = Scene_Map.prototype.callMenu; this.Scene_Map_onMapLoaded = Scene_Map.prototype.onMapLoaded; };
    OcRam_Core.prototype.debug = function () { /* Debug core? console.log("OcRam_Core", arguments); */ };
    OcRam_Core.prototype.getBoolean = function (s) { /* Get 'safe' boolean */ if (!s) return false; s = s.toString().toLowerCase(); return (s == "true" && s != "0") ? true : false; };
    OcRam_Core.prototype.getArray = function (a, b) { /* Get plugin param array */ return a ? eval(a) : b || []; };
    OcRam_Core.prototype.getFloat = function (n) { /* Get float */ return isNaN(n - parseFloat(n)) ? 0 : parseFloat(n); };
    OcRam_Core.prototype.regulateRGBG = function (obj) { /* Regulate RGBG value (used in tints) */ obj.Red = parseInt(obj.Red).clamp(-255, 255); obj.Green = parseInt(obj.Green).clamp(-255, 255); obj.Blue = parseInt(obj.Blue).clamp(-255, 255); obj.Gray = parseInt(obj.Gray).clamp(-255, 255); return obj; };
    OcRam_Core.prototype.regulateHexRGBA = function (p) { /* Regulate HEX RGBA value */ if (p.substr(0, 1) !== "#") p = "#" + p; if (p.length == 7) p = p + "ff"; return /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(p)[0] || "#ffffffff"; }
    OcRam_Core.prototype.getJSON = function (s) { /* Get 'safe' JSON */ try { return JSON.parse(s); } catch (ex) { return null; } };
    OcRam_Core.prototype.getJSONArray = function (a) { /* Get 'safe' JSON Array */ var tmp = []; if (a) { OcRam.getArray(a, []).forEach(function (s) { tmp.push(OcRam.getJSON(s)); }); } return tmp; };
    OcRam_Core.prototype.followers = function () { /* Only a shortcut to $gamePlayer._followers.visibleFollowers(); */ return $gamePlayer ? $gamePlayer._followers.visibleFollowers() : []; };
    OcRam_Core.prototype.setIndoorsFlag = function () { /* Set indoors flag - Each plugin will call this when needed */ if (DataManager.isEventTest()) return; if ($dataMap.meta["indoors"] !== undefined) { this.debug("Indoors meta tag found in MAP note field!", $dataMap.meta); this._isIndoors = true; } else { if ($dataTilesets[$dataMap.tilesetId].meta["indoors"] !== undefined) { this.debug("Indoors meta tag found in TILESET note field!", $dataTilesets[$dataMap.tilesetId].meta); this._isIndoors = true; } else { this.debug("Indoors meta tag was NOT found!", undefined); this._isIndoors = false; } } };
    OcRam_Core.prototype.isIndoors = function () { /* Get indoors flag */ return this._isIndoors; };
    OcRam_Core.prototype.runCE = function (pCE_Id) { /* Run common event */ if ($gameTemp.isCommonEventReserved()) { var tmpId = pCE_Id; var tc = this; setTimeout(function () { tc.runCE(tmpId); }, 17); } else { $gameTemp.reserveCommonEvent(pCE_Id); } };
    OcRam_Core.prototype.extendMethod = function (c, b, cb) { /* Extend/override any method */ c[b] = function () { return cb.apply(this, arguments); }; };
    OcRam_Core.prototype.extendProto = function (c, b, cb) { /* Extend/override any proto */ c.prototype[b] = function () { return cb.apply(this, arguments); }; };
    OcRam_Core.prototype.addPlugin = function (name, version) { /* Initialize new OcRam plugin */ this[name] = {}; var new_plugin = this[name]; Imported["OcRam_" + name] = true; this.plugins.push(name); this[name]._menuCalled = false; new_plugin.name = name; new_plugin.version = version; new_plugin.parameters = PluginManager.parameters("OcRam_" + new_plugin.name); if (this.getBoolean(new_plugin.parameters["Debug mode"])) { new_plugin.debug = function () { var args = [].slice.call(arguments); args.unshift("OcRam_" + new_plugin.name + " (v" + new_plugin.version + ")", ":"); console.log.apply(console, args); }; console.log("OcRam_" + new_plugin.name + " (v" + new_plugin.version + ")", "Debug mode:", "Enabled"); console.log("OcRam_" + new_plugin.name + " (v" + new_plugin.version + ")", "Parameters:", new_plugin.parameters); } else { new_plugin.debug = function () { }; } var oc = this; new_plugin.extend = function (c, b, cb) { var cb_name = c.name + "_" + b; if (c[b]) { this[cb_name] = c[b]; oc.extendMethod(c, b, cb); } else { this[cb_name] = c.prototype[b]; oc.extendProto(c, b, cb); } }; }; var OcRam = new OcRam_Core(); // Create new OcRam_Core! (Below aliases)
    Scene_Map.prototype.callMenu = function () { /* Menu called? */ OcRam.Scene_Map_callMenu.call(this); OcRam.debug("Menu called:", true); OcRam._menuCalled = true; OcRam.plugins.forEach(function (p) { OcRam[p]._menuCalled = true; }); };
    Scene_Map.prototype.onMapLoaded = function () { /* Set and get tile dimensions and indoors flag */ OcRam.Scene_Map_onMapLoaded.call(this); if (!OcRam._menuCalled) { OcRam.twh = [$gameMap.tileWidth(), $gameMap.tileHeight()]; OcRam.twh50 = [OcRam.twh[0] * 0.5, OcRam.twh[1] * 0.5]; OcRam._screenTWidth = Graphics.width / OcRam.twh[0]; OcRam._screenTHeight = Graphics.height / OcRam.twh[1]; OcRam.debug("Tile w/h:", OcRam.twh); OcRam.setIndoorsFlag(); OcRam.menuCalled = false; } };
    CanvasRenderingContext2D.prototype.line = function (x1, y1, x2, y2) { /* Draw line to canvas context */ this.beginPath(); this.moveTo(x1, y1); this.lineTo(x2, y2); this.stroke(); };
    Game_Map.prototype.adjustX_OC = function (x) { /* Optimized core adjustX */ if (this.isLoopHorizontal()) { if (x < this._displayX - (this.width() - this.screenTileX()) * 0.5) { return x - this._displayX + $dataMap.width; } else { return x - this._displayX; } } else { return x - this._displayX; } };
    Game_Map.prototype.adjustY_OC = function (y) { /* Optimized core adjustY */ if (this.isLoopVertical()) { if (y < this._displayY - (this.height() - this.screenTileY()) * 0.5) { return y - this._displayY + $dataMap.height; } else { return y - this._displayY; } } else { return y - this._displayY; } };
    Game_CharacterBase.prototype.screenX_OC = function () { /* Optimized core screenX */ return Math.round($gameMap.adjustX_OC(this._realX) * OcRam.twh[0] + OcRam.twh50[0]); };
    Game_CharacterBase.prototype.screenY_OC = function () { /* Optimized core screenY */ return Math.round($gameMap.adjustY_OC(this._realY) * OcRam.twh[1] + OcRam.twh50[0] - this.shiftY() - this.jumpHeight()); };
} if (parseFloat(OcRam.version) < 1.05) alert("OcRam core v1.05 is required!");

//------------------------------------------------------------------------------
// OcRam plugins - OcRam_Local_Coop.js
//==============================================================================

"use strict"; if (!Imported || !Imported.OcRam_Core) alert('OcRam_Core.js ' +
    'is required!'); OcRam.addPlugin("Local_Coop", "3.07");

var OcRam_Local_Coop = OcRam.Local_Coop; // For backward compatibility!
Yanfly.Slip = Yanfly.Slip || false;

/*:
 * @plugindesc v3.07 Local Coop -plugin up to 4 players from OcRam. 
 * PLUGIN NAME MUST BE OcRam_Local_Coop.js
 * @author OcRam
 *
 * @param Show player turns in battle
 * @type boolean
 * @desc Shows who's turn it is at the moment
 * @default true
 *
 * @param Confirm SRD Timed Attack
 * @type boolean
 * @desc true = Confirms if player X is ready.
 * @default true
 *
 * @param Player join button (gamepad)
 * @type number
 * @desc Default to 9 (start)
 * @default 9
 *
 * @param Player drop button (gamepad)
 * @type number
 * @desc Default to 8 (select)
 * @default 8
 *
 * @param Player drop confirm button (gamepad)
 * @type number
 * @desc Default to 0 (none). Example 9 will require also start button to drop.
 * @default 0
 *
 * @param Show info text
 * @type boolean
 * @desc true = Show info text on screen (join / drop / turn). false = Not in use
 * @default true
 *
 * @param Info text fade time
 * @parent Show info text
 * @type number
 * @desc How many frames until fade? Default 120
 * @default 120
 *
 * @param Keyboard2
 * @type text
 * @desc Keys: [up][left][down][right][b0][b1][b2][b3][select][start] [next_actor][previous_actor]
 * @default wasdtfghzx12
 *
 * @param Player in turn variable id
 * @type variable
 * @desc 0 = not in use, 1-n = variable id to check which player is on turn
 * @default 0
 *
 * @param Max number of players
 * @type number
 * @desc How many players is maximum (values 1-4)
 * @default 4
 *
 * @param Block P2 join switch id
 * @type switch
 * @desc Specify here switch id which will BLOCK player 2 joining the game
 * @default 0
 *
 * @param Block P3 join switch id
 * @type switch
 * @desc Specify here switch id which will BLOCK player 3 joining the game
 * @default 0
 *
 * @param Block P4 join switch id
 * @type switch
 * @desc Specify here switch id which will BLOCK player 4 joining the game
 * @default 0
 *
 * @param Player enter CE
 * @type common_event
 * @desc Which common event should be executed when new player enters the game
 * @default 0
 *
 * @param Player leave CE
 * @type common_event
 * @desc Which common event should be executed when player leaves the game
 * @default 0
 * 
 * @param Actor toggling
 * @type boolean
 * @desc Allow actor toggling?
 * @default true
 * 
 * @param Allow toggle for ALL
 * @parent Actor toggling
 * @type boolean
 * @desc true = Allow actor toggle for ALL (might cause some chaos), false = Allow actor toggling only for CURRENT actor
 * @default false
 * 
 * @param Previous actor key
 * @parent Actor toggling
 * @type number
 * @desc KeyCode for "toggle to previous actor" (besides gamepad LB)
 * @default 33
 * 
 * @param Next actor key
 * @parent Actor toggling
 * @type number
 * @desc KeyCode for "toggle to next actor" (besides gamepad RB)
 * @default 34
 * 
 * @param Focus blink time
 * @parent Actor toggling
 * @type number
 * @desc Time in milliseconds for blinking when actor gains focus.
 * @default 374
 * 
 * @param Focus blink opacity
 * @parent Actor toggling
 * @type number
 * @desc Opacity for blinking when actor gets focus.
 * @default 128
 * 
 * @param Players collide
 * @type boolean
 * @desc Will players collide?
 * @default false
 * 
 * @param Map edge block
 * @type boolean
 * @desc If on/true force players to be on same screen.
 * @default true
 *
 * @param Debug mode
 * @type boolean
 * @desc Write some events to console log (F8 or F12).
 * @default false
 *
 * @help
 * ------------------------------------------------------------------------------
 * Introduction                                      (Embedded OcRam_Core v1.5)
 * ==============================================================================
 * This plugin allows up to 4 players to control their own party member.
 *
 * This plugin is compatible with all Yanfly battle -plugins
 *     dtb = Default Turn Battle
 *     atb = Active Turn Battle
 *     ctb = Charge Turn Battle
 *     stb = Standard Turn Battle
 *
 * This plugin is also compatible with: "VE_DiagonalMovement", "Olivia",
 * "OcRam_Passages", "Ellye_ATB" & "SRD_TimedAttack*" -plugins
 *
 * Important! Put this plugin AFTER supported plugins in your plugin list!
 *
 * Autodrop/add gamepad feature will ensure seamless integration with gamepads.
 * Player will be dropped if he/she unplugs gamepad. And gets back in when
 * gamepad is plugged on again (key press is still required).
 *
 * ------------------------------------------------------------------------------
 * Usage
 * ==============================================================================
 *
 * General help:
 *      1. Give plugin desired parameters.
 *      2. Extra players (2 - 4) will control followers in joining order
 *      3. Join with start button (by default)
 *      4. Drop with select + start buttons (by default) (P1 can't drop)
 *      5. Switch between actors with LB/RB and/or with defined keys on Keyboard
 *
 * ------------------------------------------------------------------------------
 * Plugin commands
 * ==============================================================================
 * drop_player X        (Drop player X now)
 * max_players X        (will change max players (auto drops starting from P4))
 * assign_actor X Y     (assign actorId X to player Y)
 * swap_players X Y     (swaps players X and Y input devices)
 *                      Player indexes will start at 1
 * kb2_buttons wasd...  [up][left][down][right][b0][b1][b2][b3][select][start]
 *                      [next_actor][previous_actor]
 *                      (ONLY ALFA-NUMERIC KEYS SHOULD BE USED!)
 * apply_to_player X    (apply all moveroutes, balloons and animations to this)
 * apply_to_follower X  (apply all moveroutes, balloons and animations to this)
 * followers_follow     Yes = Followers will follow player 1, No = they won't?
 * map_edge_block       Yes = Players are forced to same screen, No = Well...
 * players_collide      Yes = Players will collide, No = They won't collide?
 * allow_toggle         Yes = Allow toggling, No = Do NOT allow actor toggling
 * allow_toggle_for_all Yes = Any player can toggle actors any time, No != Yes
 * set_player_in_turn X (X = player index 1 to 4, if player not present X = P1)
 * 
 * ------------------------------------------------------------------------------
 * Script commands and objects
 * ==============================================================================
 * 
 * $gameMap.currentActorId()        Get actorId who initiated event.
 * $gameMap.focusToNextActor()      Focus camera to next party member
 * $gameMap.focusToPreviousActor()  Focus camera to previous party member
 * OcRam.Local_Coop.setPlayerInTurn(n)  Where n = player index (1 - 4)
 * 
 * $allPlayers          Array where all player objects are stored
 * $tempGamePlayer_OC   Temporary player object who started event (null if P1)
 * $applyToChar_OC      Set movement routes to this char instead of player
 * 
 * ----------------------------------------------------------------------------
 * Terms of Use
 * ============================================================================
 * Edits are allowed as long as "Terms of Use" is not changed in any way.
 *
 * NON-COMMERCIAL USE: Free to use with credits to 'OcRam'
 *
 * If you gain money with your game by ANY MEANS (inc. ads, crypto-mining,
 * micro-transactions etc..) it's considered as COMMERCIAL use of this plugin!
 *
 * COMMERCIAL USE: (Standard license: 20 EUR, No-credits license: 60 EUR)
 * Payment via PayPal (https://paypal.me/MarkoPaakkunainen), please mention
 * PLUGIN NAME(S) you are buying / ALL plugins and your PROJECT NAME(S).
 *
 * Licenses are purchased per project and standard license requires credits.
 * If you want to buy several licenses: Every license purhased will give you
 * discount of 2 EUR for the next license purchase until minimum price of
 * 2 EUR / license. License discounts can be used to any of my plugins!
 * ALL of my plugins for 1 project = 40 EUR (standard licenses)
 *
 * https://forums.rpgmakerweb.com/index.php?threads/ocram-local-coop.90808
 *
 * DO NOT COPY, RESELL OR CLAIM ANY PIECE OF THIS SOFTWARE AS YOUR OWN!
 * Copyright (c) 2020, Marko Paakkunainen // mmp_81 (at) hotmail.com
 *
 * ------------------------------------------------------------------------------
 * Version History
 * ==============================================================================
 * 2019/11/04 v3.00 - Initial release
 * 2019/11/07 v3.01 - Jump command will listen to "followers_follow no" command
 *                    Player collide and nearest player will apply for followers
 *                    also if "followers_follow" is set to "no"
 * 2019/11/27 v3.02 - YEP_X_BattleSysCTB works again
 *                    Toggle actor feature will gather followers if too far
 * 2020/02/23 v3.03 - OcRam core v1.03 + Fixed some bugs if party/db had 
 *                    less than 4 actors (Credits: wolftail)
 *                    Fixed F9 bug with YEP debug menu (Credits: deadlyessence01)
 * 2020/03/14 v3.04 - OcRam core v1.04 (requirement for all of my plugins)
 *                    Toggle actor now works better while moving...
 *                    Keyboard2 works again
 * 2020/05/02 v3.05 - setPlayerInTurn so that you can toggle players in the
 *                    middle of event - also as plugin cmd (Credits to Sed808)!
 * 2020/06/12 v3.06 - If followers follow = off - Player 2-4 leaving game won't 
 *                    teleport controlled character to player 1
 *                    Embedded OcRam Core v1.5
 * 2021/03/07 v3.07 - Now "Event/Player Touch" triggers works also for P2-4
 *                    (Credits to SkottGaming)
 */
/*
 * ------------------------------------------------------------------------------
 * RMMV CORE function overrides (destructive) are listed here
 * ==============================================================================
 *     Input._updateGamepadState
 *     Game_Followers.prototype.updateMove
 *     Scene_Map.prototype.processMapTouch
 *     Game_Character.prototype.turnTowardPlayer
 *     Game_Character.prototype.turnAwayFromPlayer
 *     Game_Character.prototype.moveTowardPlayer
 *     Game_Character.prototype.moveAwayFromPlayer
 *     Game_Event.prototype.checkEventTriggerTouch
 *     Game_Interpreter.prototype.command205 // Set movement route
 *     Game_Interpreter.prototype.command212 // Show animation
 *     Game_Interpreter.prototype.command213 // Show balloon
 */

// ------------------------------------------------------------------------------
// Global Namespace
// ==============================================================================
var $allPlayers = [$gamePlayer, null, null, null]; // Global player objects
var $tempGamePlayer_OC = null; // Player who started the event
var $applyToChar_OC = null; // Set movement routes to this char instead of player

// ------------------------------------------------------------------------------
// rpg_sprites.js - New destination sprite class for extra players
// ==============================================================================
function Sprite_Destination2() {
    this.initialize.apply(this, arguments);
}

Sprite_Destination2.prototype = Object.create(Sprite.prototype);
Sprite_Destination2.prototype.constructor = Sprite_Destination2;

Sprite_Destination2.prototype.initialize = function () {
    Sprite.prototype.initialize.call(this);
    this.createBitmap();
    this._frameCount = 0;
};

Sprite_Destination2.prototype.update = function () {
    Sprite.prototype.update.call(this);
    if ($gameTemp.isDestinationValid2()) {
        this.updatePosition();
        this.updateAnimation();
        this.visible = true;
    } else {
        this._frameCount = 0;
        this.visible = false;
    }
};

Sprite_Destination2.prototype.createBitmap = function () {
    var tileWidth = $gameMap.tileWidth();
    var tileHeight = $gameMap.tileHeight();
    this.bitmap = new Bitmap(tileWidth, tileHeight);
    this.bitmap.fillAll('#ffdd88');
    this.anchor.x = 0.5;
    this.anchor.y = 0.5;
    this.blendMode = Graphics.BLEND_ADD;
};

Sprite_Destination2.prototype.updatePosition = function () {
    var tileWidth = $gameMap.tileWidth();
    var tileHeight = $gameMap.tileHeight();
    var x = $gameTemp.destinationX2();
    var y = $gameTemp.destinationY2();
    this.x = ($gameMap.adjustX_OC(x) + 0.5) * tileWidth;
    this.y = ($gameMap.adjustY_OC(y) + 0.5) * tileHeight;
};

Sprite_Destination2.prototype.updateAnimation = function () {
    this._frameCount++;
    this._frameCount %= 20;
    this.opacity = (20 - this._frameCount) * 6;
    this.scale.x = 1 + this._frameCount / 20;
    this.scale.y = this.scale.x;
};

// ------------------------------------------------------------------------------
// New text layer sprite
// ==============================================================================
function Sprite_Text_OC() {
    this.initialize.apply(this, arguments);
}

Sprite_Text_OC.prototype = Object.create(Sprite.prototype);
Sprite_Text_OC.prototype.constructor = Sprite_Text_OC;

Sprite_Text_OC.prototype.initialize = function () {
    Sprite.prototype.initialize.call(this);
    this._frameCount = 0;
    this._maxFrames = 120;
    this._framesPreCalculated = this._maxFrames * 0.5;
    this._displayText = "";
    this.x = 0; this.y = 0;
};

Sprite_Text_OC.prototype.update = function () {
    Sprite.prototype.update.call(this);
    if (this._displayText != "") {
        this.visible = true;
        this.updateAnimation();
    } else {
        this.visible = false;
        this._frameCount = 0;
    }
};

Sprite_Text_OC.prototype.writeText = function (pstrText) {
    this._w = Graphics.boxWidth;
    this._h = Graphics.boxHeight;
    this.bitmap = new Bitmap(this._w, this._h);
    this.bitmap.textColor = "#ffffff";
    this.bitmap.outlineColor = "#000000";
    this.bitmap.outlineWidth = 6;
    this._fontSize = 48;
    this.anchor.x = 0; this.anchor.y = 0;
    this._displayText = pstrText;
    this._frameCount = 0;
};

Sprite_Text_OC.prototype.updateAnimation = function () {
    this._frameCount++;
    if (this._frameCount > this._maxFrames) {
        this._displayText = "";
    } else {
        if (this._frameCount > this._framesPreCalculated) {
            var calculated = this._frameCount - this._framesPreCalculated;
            this.opacity = 200 - (calculated / this._maxFrames * 200);
            this.bitmap.fontSize = (this._fontSize - calculated * 0.25) * (1 - (calculated / this._maxFrames));
            this.bitmap.clearRect(0, 0, this._w, this._h);
        } else {
            this.opacity = 200;
            this.bitmap.fontSize = this._fontSize;
        }
        this.bitmap.drawText(this._displayText, 0, Graphics.boxHeight * 0.5 - 64, Graphics.boxWidth, 32, "center");
    }
};

Sprite_Text_OC.prototype.hide = function () {
    this.visible = false;
};

(function () {

    // ------------------------------------------------------------------------------
    // Private Utility functions - Inherited to all sub scopes here
    // ==============================================================================

    var OcRam_Utils = {}; var _this = this;

    // ------------------------------------------------------------------------------
    // Plugin variables and parameters
    // ==============================================================================

    var _screenHeight = Graphics.height / 48;
    var _screenWidth = Graphics.width / 48;

    var _playerDevices = [-1, null, null, null]; // Player input devices // null = NOT plugged in
    var _playerInTurn = 0; // Player in turn? 0 = P1, 1 = P2 etc...
    var _isATB = false; // Is ATB (or CTB) enabled?
    var _playerCount = 1; // How many players there is in game?
    var _turnShufler = 2; // Turn shufler for the last member in 3 player game
    
    var _showPlayerTurns = OcRam.getBoolean(this.parameters['Show player turns in battle']);
    var _playerJoinButton = Number(this.parameters['Player join button (gamepad)']) || 9;
    var _playerDropButton = Number(this.parameters['Player drop button (gamepad)']) || 8;
    var _playerDropConfirmButton = Number(this.parameters['Player drop confirm button (gamepad)']) || 0;
    var _confirmSrdTA = OcRam.getBoolean(this.parameters['Confirm SRD Timed Attack']);
    var _showInfoText = OcRam.getBoolean(this.parameters['Show info text']);
    var _textFadeTime = Number(this.parameters['Info text fade time']) || 120;
    var _debugMode = OcRam.getBoolean(this.parameters['Debug mode']);
    var _kb2 = String(this.parameters['Keyboard2']).toLowerCase() || "wasdtfghzx12";
    var _playerInTurnVarId = Number(this.parameters['Player in turn variable id']) || 0;
    var _maxNumberOfPlayers = Number(this.parameters['Max number of players']) || 4;
    var _blockP2 = Number(this.parameters['Block P2 join switch id']) || 0;
    var _blockP3 = Number(this.parameters['Block P3 join switch id']) || 0;
    var _blockP4 = Number(this.parameters['Block P4 join switch id']) || 0;
    var _blockPlayeJoinSwitches = _blockP2 + "," + _blockP3 + "," + _blockP4;
    var _playerEnterCE = Number(this.parameters['Player enter CE']) || 0;
    var _playerLeaveCE = Number(this.parameters['Player leave CE']) || 0;
    var _blinkOpacity = Number(this.parameters['Focus blink opacity']) || 128;
    var _blinkTime = Number(this.parameters['Focus blink time']) || 374;
    var _allowToggleForAll = OcRam.getBoolean(this.parameters['Allow toggle for ALL']);
    var _toggleNextActor = Number(this.parameters['Next actor key']) || 13;
    var _togglePreviousActor = Number(this.parameters['Previous actor key']) || 8;
    var _playersCollide = OcRam.getBoolean(this.parameters['Players collide']);
    var _mapEdgeBlock = OcRam.getBoolean(this.parameters['Map edge block']);
    var _allowTogling = OcRam.getBoolean(this.parameters['Actor toggling']);

    var _sceneIsReady = false; var _partyInBattle = false;
    var _screenWidth = 0; var _screenHeight = 0;

    var _sceneTextLayer = null; // Draw info texts here
    var _currentPlayer = 1; // For toggling between actors

    var _membersNotSigned = []; var _canMove = false; var _isFading = false;
    var _oliviaMustStart = false; var _cfTimeoutHandle = 0; var _blinkHandle = 0;

    _maxNumberOfPlayers = (_maxNumberOfPlayers > 4) ? 4 : (_maxNumberOfPlayers < 1) ? 1 : _maxNumberOfPlayers;

    // 2D arrays for player inputs
    Input._OC_gamepadStates = [[], [], [], []]; Input._currentState2 = [[], [], [], []];

    // Validate switch Ids like: nnnn,nnnn,nnnn
    if (!(_blockPlayeJoinSwitches.match(/\d?\d?\d?\d\,\d?\d?\d?\d\,\d?\d?\d?\d/))) {
        this.debug("Block Player Controls Switch Id's were invalid DEFAULTING TO: 0,0,0");
        _blockPlayeJoinSwitches = "0,0,0"; // Default to no join block switches in use
    } var _joinSwitchIds = _blockPlayeJoinSwitches.split(",");

    _joinSwitchIds[0] = parseInt(_joinSwitchIds[0]);
    _joinSwitchIds[1] = parseInt(_joinSwitchIds[1]);
    _joinSwitchIds[2] = parseInt(_joinSwitchIds[2]);

    var _joinSwitchValues = [false, false, false]; var _followersFollow = true;

    // Extend the gamepad mapper (for start and select)
    Input.gamepadMapper = {
        0: 'ok',        // A
        1: 'cancel',    // B
        2: 'shift',     // X
        3: 'menu',      // Y
        4: 'pageup',    // LB
        5: 'pagedown',  // RB
        8: 'select',    // Select
        9: 'start',     // Start
        12: 'up',       // D-pad up
        13: 'down',     // D-pad down
        14: 'left',     // D-pad left
        15: 'right'    // D-pad right
    };

    // Invert the gamepad mapper
    Input.gamepadMapperInv = {
        'ok': 0,        // A
        'cancel': 1,    // B
        'shift': 2,     // X
        'menu': 3,      // Y
        'pageup': 4,    // LB
        'pagedown': 5,  // RB
        'select': 8,    // Select
        'start': 9,     // Start
        'up': 12,       // D-pad up
        'down': 13,     // D-pad down
        'left': 14,     // D-pad left
        'right': 15    // D-pad right
    };

    var _useSlipperyTiles = false;
    if (Yanfly) {
        if (Yanfly.Slip) _useSlipperyTiles = true;
    }

    this.setPlayerInTurn = function (player_index) {
        this.debug("OcRam.Local_Coop.setPlayerInTurn(" + player_index + ");", "$allPlayers:", $allPlayers);
        if (player_index < 1) player_index = 1;
        if (player_index > 4) player_index = 4;
        _playerInTurn = player_index - 1;
        if (player_index == 1) {
            $tempGamePlayer_OC = null;
        } else {
            $tempGamePlayer_OC = $allPlayers[player_index - 1];
        } if (!$tempGamePlayer_OC) _playerInTurn = 0;
        setPlayerInTurnVar(_playerInTurn);
    };

    // ------------------------------------------------------------------------------
    // Plugin commands
    // ==============================================================================
    this.extend(Game_Interpreter, "pluginCommand", function (command, args) {
        switch (command) {
            case "set_player_in_turn": _this.debug("set_player_in_turn", args);
                if (args[0]) _this.setPlayerInTurn(Number(args[0])); break;

            case "followers_follow": _this.debug("followers_follow", args);
                if (args[0].toLowerCase() == "no" || args[0].toLowerCase() == "false" || args[0].toLowerCase() == "0") {
                    _followersFollow = false;
                } else {
                    _followersFollow = true;
                } _this.debug("_followersFollow:", _followersFollow); break;

            case "apply_to_player": _this.debug("apply_to_player", args);
                if (!args[0]) args[0] = 0;
                var p = Number(args[0]) - 1; p = p > 3 ? 3 : p;
                if (p < 0) {
                    $applyToChar_OC = null;
                } else {
                    $applyToChar_OC = $allPlayers[p] == null ? $gamePlayer : $allPlayers[p];
                } _this.debug("$applyToChar_OC:", $applyToChar_OC); break;

            case "apply_to_follower": _this.debug("apply_to_follower", args);
                var vflwrs = $gamePlayer._followers.visibleFollowers();
                var p = Number(args[0]) - 1; p = p < 0 ? 0 : p;
                p = p > vflwrs.length ? vflwrs.length : p;
                $applyToChar_OC = vflwrs[p]; _this.debug("$applyToChar_OC:", $applyToChar_OC); break;

            case "assign_actor": _this.debug("assign_actor", args);
                var actor_id = Number(args[0]);
                var player_index = Number(args[1]) - 1;
                assignActor(actor_id, player_index); break;

            case "swap_players": _this.debug("swap_players", args);
                var p1 = Number(args[0]) - 1; var p2 = Number(args[1]) - 1;
                swapPlayers(p1, p2); break;

            case "kb2_buttons": _this.debug("kb2_buttons", args);
                _kb2 = (args[0]).toLowerCase(); break;

            case "drop_player": _this.debug("drop_player", args);
                var p1 = Number(args[0]) - 1;
                dropDevice(_playerDevices[p1]); break;

            case "max_players": _this.debug("max_players", args);
                var p = Number(args[0]);
                p = (p > 4) ? 4 : (p < 1) ? 1 : p;
                if (_playerCount > p) dropPlayerStartingFromP4();
                if (_playerCount > p) dropPlayerStartingFromP4();
                if (_playerCount > p) dropPlayerStartingFromP4();
                _maxNumberOfPlayers = p; break;

            case "players_collide": _this.debug("players_collide", args);
                if (args[0].toLowerCase() == "on") {
                    _playersCollide = true;
                } else {
                    _playersCollide = true;
                } break;

            case "map_edge_block": _this.debug("map_edge_block", args);
                if (args[0].toLowerCase() == "on") {
                    _mapEdgeBlock = true;
                } else {
                    _mapEdgeBlock = true;
                } break;

            case "allow_toggle_for_all": _this.debug("allow_toggle_for_all", args);
                if (args[0].toLowerCase() == "on") {
                    _allowToggleForAll = true;
                } else {
                    _allowToggleForAll = true;
                } break;

            case "allow_toggle": _this.debug("allow_toggle", args);
                if (args[0].toLowerCase() == "on") {
                    _allowTogling = true;
                } else {
                    _allowTogling = true;
                } break;

            default:
                _this["Game_Interpreter_pluginCommand"].apply(this, arguments);
        }
    });

    // ------------------------------------------------------------------------------
    // RMMV core - Aliases
    // ==============================================================================

    // Update player control booleans
    this.extend(Game_Switches, "onChange", function () {
        _joinSwitchValues = [
            (_joinSwitchIds[0] != 0) ? $gameSwitches.value(_joinSwitchIds[0]) : false,
            (_joinSwitchIds[1] != 0) ? $gameSwitches.value(_joinSwitchIds[1]) : false,
            (_joinSwitchIds[2] != 0) ? $gameSwitches.value(_joinSwitchIds[2]) : false
        ]; _this.debug("Control Switch Values:", _joinSwitchValues[0] + ", " + _joinSwitchValues[1] + ", " + _joinSwitchValues[2]);
        if (_joinSwitchValues[0] && _playerDevices[1] != null) dropDevice(_playerDevices[1]);
        if (_joinSwitchValues[1] && _playerDevices[2] != null) dropDevice(_playerDevices[2]);
        if (_joinSwitchValues[2] && _playerDevices[3] != null) dropDevice(_playerDevices[3]);
        _this["Game_Switches_onChange"].apply(this, arguments);
    });

    // Clear P2-4 destination on event start
    this.extend(Game_Event, "start", function () {
        $gameTemp.clearDestination2(); _this["Game_Event_start"].apply(this, arguments);
    });

    // Create text layer for info messages
    this.extend(Scene_Base, "createWindowLayer", function () {
        _this["Scene_Base_createWindowLayer"].apply(this, arguments);
        _sceneTextLayer = new Sprite_Text_OC(); _sceneTextLayer.z = 999;
        this._windowLayer.addChild(_sceneTextLayer);
    });

    // Create destination sprite for followers also
    this.extend(Spriteset_Map, "createDestination", function () {
        _this["Spriteset_Map_createDestination"].apply(this, arguments);
        this._destinationSprite2 = new Sprite_Destination2();
        this._destinationSprite2.z = 9;
        this._tilemap.addChild(this._destinationSprite2);
    });

    // Reset _playerInTurn on scene_map (gives control back to P1)
    this.extend(Game_Event, "unlock", function () {
        _this.debug("Event unlocked by player:", _playerInTurn);
        _this.debug($tempGamePlayer_OC, $allPlayers);
        if ($allPlayers[_playerInTurn] != null) $allPlayers[_playerInTurn]._preventNextOk = true;
        _this["Game_Event_unlock"].apply(this, arguments);
        var _clearPIT = _playerInTurn;
        setTimeout(function () { // Give time for gamepad iterations
            _playerInTurn = 0; if ($tempGamePlayer_OC != null) Input.OC_resetControllers(true);
            if (_playerDevices[0] == -1) $gameTemp.clearDestination2();
            $tempGamePlayer_OC = null; _canMove = true; setPlayerInTurnVar(1);
        }, 100);
        setTimeout(function () { // cool down for next ok
            if ($allPlayers[_clearPIT] != null) { $allPlayers[_clearPIT]._preventNextOk = false; }
        }, 1000); $applyToChar_OC = null;
    });

    // Reset some flags on player transfer
    this.extend(Game_Player, "performTransfer", function () {
        if (this.isTransferring()) {
            _sceneIsReady = false; _canMove = false;
            _this["Game_Player_performTransfer"].apply(this, arguments);
            setTimeout(function () { // Give time for gamepad iterations
                _canMove = true;
            }, 200);
        }
    });

    // Jump all only if followers are following!
    this.extend(Game_Player, "jump", function (xPlus, yPlus) {
        if (_followersFollow) {
            _this["Game_Player_jump"].apply(this, arguments);
        } else {
            Game_Character.prototype.jump.call(this, xPlus, yPlus);
        }
    });

    // Check battle system and init variables
    this.extend(Scene_Map, "isReady", function () {
        var tmp_rdy = _this["Scene_Map_isReady"].apply(this, arguments);
        _partyInBattle = false; getAssignedFollowers();
        if (tmp_rdy && $gameMap != undefined && $gameMap != null) {
            _joinSwitchValues = [
                (_joinSwitchIds[0] != 0) ? $gameSwitches.value(_joinSwitchIds[0]) : false,
                (_joinSwitchIds[1] != 0) ? $gameSwitches.value(_joinSwitchIds[1]) : false,
                (_joinSwitchIds[2] != 0) ? $gameSwitches.value(_joinSwitchIds[2]) : false
            ]; _this.debug("Control Switch Values:", _joinSwitchValues[0] + ", " + _joinSwitchValues[1] + ", " + _joinSwitchValues[2]);
            if (Imported.Ellye_ATB) {
                _isATB = true;
            } else {
                if (Imported.YEP_BattleEngineCore && (Imported.YEP_X_BattleSysATB || Imported.YEP_X_BattleSysCTB)) {
                    _isATB = $gameSystem.getBattleSystem() == "atb" || $gameSystem.getBattleSystem() == "ctb";
                } else {
                    _isATB = false;
                }
            } if (_this._menuCalled) _this._menuCalled = false;
            setTimeout(function () { // Wait for gamepad iterations
                _canMove = true;
                _playerInTurn = 0;
                setPlayerInTurnVar(_currentPlayer); 
            }, 120);
            _sceneIsReady = true; $allPlayers[0] = $gamePlayer;
            _screenWidth = Math.ceil(Graphics.boxWidth / $gameMap.tileWidth());
            _screenHeight = Math.ceil(Graphics.boxHeight / $gameMap.tileHeight());
            $gameTemp.clearDestination2();
            _this.debug("Scene_Map.isReady(true) - Battle System ATB/CTB:", _isATB);
        } return tmp_rdy;
    });

    // Check player turns... depending on battle system (this is for ATB/CTB)
    this.extend(BattleManager, "update", function () {
        _partyInBattle = true; _this["BattleManager_update"].apply(this, arguments); if (_playerCount < 2) return;
        if (this._phase === 'battleEnd' && !_this._menuCalled) {
            Input.OC_resetControllers(false);
            _this._menuCalled = true; _playerInTurn = 0; _this.debug("update() - BattleEnd(ok) & playerInTurn:", (_playerInTurn + 1));
        } else {
            if (_isATB) {
                if (this.isInputting()) {
                    Input.OC_resetControllers(true);
                    _this._menuCalled = false;
                    getPlayerInTurn(this._actorIndex, true);
                    _this.debug("update(" + this._actorIndex + ") - playerInTurn:", (_playerInTurn + 1));
                    if (_playerCount > 1) {
                        if (_showPlayerTurns) showTextOnScreen("Player " + (_playerInTurn + 1) + " turn!", true);
                        SceneManager._scene._logWindow.clear();
                        SceneManager._scene._logWindow.addText("Player " + (_playerInTurn + 1) + " turn!");
                    }
                }
            }
        }
    });

    // Check player turns... depending on battle system (this is for DTB/STB)
    this.extend(BattleManager, "changeActor", function (newActorIndex, lastActorActionState) {
        if (_playerCount > 1) {
            if (newActorIndex > -1 && !_isATB) {
                Input.OC_resetControllers(true);
                _this._menuCalled = false;
                getPlayerInTurn(newActorIndex, true);
                _this.debug("changeActor(" + newActorIndex + ") - playerInTurn:", (_playerInTurn + 1));
                if (_playerCount > 1) {
                    if (_showPlayerTurns) showTextOnScreen("Player " + (_playerInTurn + 1) + " turn!", true);
                    SceneManager._scene._logWindow.clear();
                    SceneManager._scene._logWindow.addText("Player " + (_playerInTurn + 1) + " turn!");
                }
            } if (this.checkBattleEnd() && !_this._menuCalled) {
                Input.OC_resetControllers(false);
                _this._menuCalled = true; _playerInTurn = 0; _this.debug("changeActor() - BattleEnd(ok) & playerInTurn:", (_playerInTurn + 1));
            }
        }
        _this["BattleManager_changeActor"].apply(this, arguments);
    });

    // To support "Timed Attack" By "SumRndmDde"
    this.extend(BattleManager, "startAction", function () {

        if (_playerCount > 1) {
            var action = this._subject.currentAction();

            if (Imported["SumRndmDde Timed Attack Core"] > 1.0 && this._subject.isActor()) {

                Input.OC_resetControllers(true);

                if (action.item().meta["SRD TAS"]) {
                    _this.debug("SRD TAS META TAG", "HAS been found.");
                    for (var i = 0; i < $gameParty._actors.length; i++) {
                        if ($gameParty._actors[i] == this._subject._actorId) var pmi = i;
                    } getPlayerInTurn(pmi, false);
                    if (_confirmSrdTA && _playerCount > 1) {
                        if (_showPlayerTurns) showTextOnScreen("Player " + (_playerInTurn + 1) + " turn!", true);
                        SceneManager._scene._logWindow.clear();
                        SceneManager._scene._logWindow.addText("Player " + (_playerInTurn + 1) + " turn!");
                        $gameMessage.add("Player " + (_playerInTurn + 1) + " ready?");
                    }

                } else {
                    _this.debug("SRD TAS META TAG", "NOT found.");
                }
            }
        }
        
        _this["BattleManager_startAction"].apply(this, arguments);

    });

    this.extend(Input, "_onKeyDown", function (event) { 

        var c = String.fromCharCode(event.keyCode).toLowerCase();
        if (event.keyCode > 111 && event.keyCode < 124) c = "¤";
        var kb2b = _kb2.indexOf(c);

        if (event.keyCode == _toggleNextActor && $gameMap._mapId) $gameMap.focusToNextActor(-1);
        if (event.keyCode == _togglePreviousActor && $gameMap._mapId) $gameMap.focusToPreviousActor(-1);

        if (kb2b == 10 && $gameMap._mapId) $gameMap.focusToPreviousActor(-2);
        if (kb2b == 11 && $gameMap._mapId) $gameMap.focusToNextActor(-2);

        if (kb2b < 0) {
            if (_playerDevices[_playerInTurn] == -1) {
                _this["Input__onKeyDown"].apply(this, arguments);
            } else {
                // Handle follower
                var buttonName = this.keyMapper[event.keyCode];
                if (buttonName) this._currentState2[buttonName] = true;
                if (event.keyCode === 0) { // For QtWebEngine on OS X
                    this.clear();
                }
            }
        } else {
            // Handle Keyboard part2
            // up(0), left(1), down(2), right(3), b0(4), b1(5), b2(6), b3(7), select(8), start(9)
            if (this._currentState2[-2] != undefined) {
                if (this._currentState2[-2][8] && kb2b == 9) {
                    dropDevice(-2);
                } else if (kb2b == 9) {
                    assignDevice(-2);
                }
            } else {
                if (kb2b == 9) assignDevice(-2);
            }
            
            var p_follower = $allPlayers[getDevicePlayer(-2) - 1];

            if (_playerDevices[_playerInTurn] == -2) {
                if (this._shouldPreventDefault(event.keyCode)) {
                    event.preventDefault();
                }
                if (event.keyCode === 144) { // Numlock
                    this.clear();
                }
                if (ResourceHandler.exists() && kb2b == 4) { // ok
                    ResourceHandler.retry();
                }
                switch (kb2b) {
                    case 0: this._currentState['up'] = true; break;
                    case 1: this._currentState['left'] = true; break;
                    case 2: this._currentState['down'] = true; break;
                    case 3: this._currentState['right'] = true; break;
                    case 4: this._currentState['ok'] = true; break;
                    case 5: this._currentState['escape'] = true; break;
                    case 6: this._currentState['shift'] = true; break;
                    case 7: this._currentState['control'] = true; break;
                    case 8: this._currentState['select'] = true; break;
                    case 9: this._currentState['start'] = true; break;
                    case 10: this._currentState['pageup'] = true; break;
                    case 11: this._currentState['pagedown'] = true; break;
                } return;
            }

            if (p_follower != null) {

                var newState = this._currentState2[-2] || [];

                switch (kb2b) {
                    case 0: newState[12] = true; break;
                    case 1: newState[14] = true; break;
                    case 2: newState[13] = true; break;
                    case 3: newState[15] = true; break;
                    case 4: newState[0] = true; break;
                    case 5: newState[1] = true; break;
                    case 6: newState[2] = true; break;
                    case 7: newState[3] = true; break;
                    case 8: newState[8] = true; break;
                    case 9: newState[9] = true; break;
                    case 10: newState[4] = true; break;
                    case 11: newState[5] = true; break;
                } this._currentState2[-2] = newState;
                if (event.keyCode === 0) { // For QtWebEngine on OS X
                    this.clear();
                }
                
                if ($tempGamePlayer_OC == null) {
                    if (!(newState[0])) p_follower._preventNextOk = false;
                    if (!(p_follower._preventNextOk)) p_follower._okIsPressed = newState[0];
                    p_follower._cancelIsPressed = newState[1];
                    p_follower._shiftIsPressed = newState[2];
                    p_follower._menuIsPressed = newState[3];
                }

                updateDirs(p_follower, newState);

            }

        }
        
    });

    this.extend(Input, "_onKeyUp", function (event) {

        var c = String.fromCharCode(event.keyCode).toLowerCase();
        if (event.keyCode > 111 && event.keyCode < 124) c = "¤";
        var kb2b = _kb2.indexOf(c);

        if (kb2b < 0) {
            if (_playerDevices[_playerInTurn] == -1) {
                _this["Input__onKeyUp"].apply(this, arguments);
            } else { // Handle follower
                var buttonName = this.keyMapper[event.keyCode];
                if (buttonName) this._currentState2[buttonName] = false;
                if (event.keyCode === 0) { // For QtWebEngine on OS X
                    this.clear();
                }
            }
        } else {

            // Handle Keyboard part2
            // up(0), left(1), down(2), right(3), b0(4), b1(5), b2(6), b3(7), select(8), start(9)
            if (_playerDevices[_playerInTurn] == -2) {
                switch (kb2b) {
                    case 0: this._currentState['up'] = false; break;
                    case 1: this._currentState['left'] = false; break;
                    case 2: this._currentState['down'] = false; break;
                    case 3: this._currentState['right'] = false; break;
                    case 4: this._currentState['ok'] = false; break;
                    case 5: this._currentState['escape'] = false; break;
                    case 6: this._currentState['shift'] = false; break;
                    case 7: this._currentState['control'] = false; break;
                    case 8: this._currentState['select'] = false; break;
                    case 9: this._currentState['start'] = false; break;
                    case 10: this._currentState['pageup'] = false; break;
                    case 11: this._currentState['pagedown'] = false; break;
                } return;
            }

            var p_follower = $allPlayers[getDevicePlayer(-2) - 1];
            if (p_follower != null) {
                var newState = this._currentState2[-2] || [];
                switch (kb2b) {
                    case 0: newState[12] = false; break;
                    case 1: newState[14] = false; break;
                    case 2: newState[13] = false; break;
                    case 3: newState[15] = false; break;
                    case 4: newState[0] = false; break;
                    case 5: newState[1] = false; break;
                    case 6: newState[2] = false; break;
                    case 7: newState[3] = false; break;
                    case 8: newState[8] = false; break;
                    case 9: newState[9] = false; break;
                    case 10: newState[4] = false; break;
                    case 11: newState[5] = false; break;
                } this._currentState2[-2] = newState;

                updateDirs(p_follower, newState);

            }
        }
    });

   this.extend(TouchInput, "_onMouseDown", function (event) {
        if (_playerDevices[_playerInTurn] == -1) {
            _this["TouchInput__onMouseDown"].apply(this, arguments);
        } else { // Handle followers
            if (!$gameParty.inBattle()) {
                var player_obj = $allPlayers[getDevicePlayer(-1) - 1];
                if (player_obj != null) {
                    if (player_obj.isVisible()) {
                        var x = Graphics.pageToCanvasX(event.pageX);
                        var y = Graphics.pageToCanvasY(event.pageY);
                        if (Graphics.isInsideCanvas(x, y)) {
                            this.x2 = x; this.y2 = y;
                            this._mousePressed2 = true;
                            this._onTrigger(this.x2, this.y2);
                        }
                    }
                }
            }
        }
    });

    this.extend(TouchInput, "_onMouseUp", function (event) {
        this._mousePressed2 = false; // P2 isn't pressing this button anymore
        _this["TouchInput__onMouseUp"].apply(this, arguments);
    });

    this.extend(TouchInput, "_onMouseMove", function (event) {
        if (_playerDevices[_playerInTurn] == -1) {
            _this["TouchInput__onMouseMove"].apply(this, arguments);
        } else { // Handle followers
            if (!$gameParty.inBattle()) {
                if (this.isPressed2()) {
                    var x = Graphics.pageToCanvasX(event.pageX);
                    var y = Graphics.pageToCanvasY(event.pageY);
                    if (Graphics.isInsideCanvas(x, y)) {
                        this.x2 = x; this.y2 = y;
                        this._onTrigger(this.x2, this.y2);
                    }
                }
            }
        }
    });

    this.extend(Game_Follower, "refreshBushDepth", function () {
        _this["Game_Follower_refreshBushDepth"].apply(this, arguments);
        $gamePlayer._followers.visibleFollowers().forEach(function (follower) {
            if (!follower._df_done) {
                if (follower._playerIndex_OC > 0) {
                    if (follower.isOnDamageFloor()) {
                        $gameParty.members().forEach(function (actor) {
                            return actor.executeFloorDamage();
                        });
                    }
                } follower._df_done = true;
            } else {
                follower._df_done = false;
            }
        });
    });
    

    // Check that all players fit in screen
    this.extend(Game_Player, "updateScroll", function (lastScrolledX, lastScrolledY) {

        if (!_mapEdgeBlock) {
            _this["Game_Player_updateScroll"].apply(this, arguments); return;
        }

        if (!$gameMap.isLoopHorizontal()) {
            if (lastScrolledX < this.scrolledX()) {
                if ($allPlayers[1] != null && ($gameMap._displayX > $allPlayers[1]._x)) return;
                if ($allPlayers[2] != null && ($gameMap._displayX > $allPlayers[2]._x)) return;
                if ($allPlayers[3] != null && ($gameMap._displayX > $allPlayers[3]._x)) return;
            } else if (lastScrolledX > this.scrolledX()) {
                var mw = $gameMap._displayX + _screenWidth - 1;
                if ($allPlayers[1] != null && (mw < $allPlayers[1]._x)) return;
                if ($allPlayers[2] != null && (mw < $allPlayers[2]._x)) return;
                if ($allPlayers[3] != null && (mw < $allPlayers[3]._x)) return;
            }
        }

        if (!$gameMap.isLoopVertical()) {
            if (lastScrolledY < this.scrolledY()) {
                if ($allPlayers[1] != null && ($gameMap._displayY > $allPlayers[1]._y)) return;
                if ($allPlayers[2] != null && ($gameMap._displayY > $allPlayers[2]._y)) return;
                if ($allPlayers[3] != null && ($gameMap._displayY > $allPlayers[3]._y)) return;
            } else if (lastScrolledY > this.scrolledY()) {
                var mh = $gameMap._displayY + _screenHeight - 1;
                if ($allPlayers[1] != null && (mh < $allPlayers[1]._y)) return;
                if ($allPlayers[2] != null && (mh < $allPlayers[2]._y)) return;
                if ($allPlayers[3] != null && (mh < $allPlayers[3]._y)) return;
            }
        }

        _this["Game_Player_updateScroll"].apply(this, arguments);

    });

    // Map border collision test
    this.extend(Game_CharacterBase, "canPass", function (x, y, d) {

        if (!_mapEdgeBlock) return _this["Game_CharacterBase_canPass"].apply(this, arguments);

        if (this.isFollower_OC() || this.isPlayer_OC()) {
            if (d != 8 && d != 2 && !$gameMap.isLoopHorizontal()) {
                var x2 = $gameMap.roundXWithDirection(x, d);
                if ($gameMap._displayX > x2 || ($gameMap._displayX + _screenWidth - 1) < x2) return false;
            } if (d != 4 && d != 6 && !$gameMap.isLoopVertical()) {
                var y2 = $gameMap.roundYWithDirection(y, d);
                if ($gameMap._displayY > y2 || ($gameMap._displayY + _screenHeight - 1) < y2) return false;
            }
        }

        return _this["Game_CharacterBase_canPass"].apply(this, arguments);

    });

    // Player collision test
    this.extend(Game_CharacterBase, "isCollidedWithCharacters", function (x, y) {
        if (_playersCollide) {
            return _this["Game_CharacterBase_isCollidedWithCharacters"].apply(this, arguments)
                || $gamePlayer._x == x && $gamePlayer._y == y ||
                $gamePlayer._followers.visibleFollowers().some(function (f) {
                    return f._x == x && f._y == y && (f._playerIndex_OC || !_followersFollow);
                });
        } else {
            return _this["Game_CharacterBase_isCollidedWithCharacters"].apply(this, arguments);
        }
    });

    // Add support to diagonal directions
    this.extend(Game_Map, "roundXWithDirection", function (x, d) {
        if (d % 2 !== 0) {
            return this.roundX(x + ((d === 9 || d === 6 || d === 3) ? 1 : (d === 7 || d === 4 || d === 1) ? -1 : 0));
        } else {
            return _this["Game_Map_roundXWithDirection"].apply(this, arguments);
        }
    });

    // Add support to diagonal directions
    this.extend(Game_Map, "roundYWithDirection", function (y, d) {
        if (d % 2 !== 0) {
            return this.roundY(y + ((d === 1 || d === 2 || d === 3) ? 1 : (d === 7 || d === 8 || d === 9) ? -1 : 0));
        } else {
            return _this["Game_Map_roundYWithDirection"].apply(this, arguments);
        }
    });

    // Warp to P1 when adding new member
    this.extend(Game_Party, "addActor", function (actorId) {

        _this["Game_Party_addActor"].apply(this, arguments);

        var new_index = $gamePlayer._followers.visibleFollowers().length - 1;

        if (new_index < 4 && new_index > -1) {
            _this.debug("addActor new_member:", new_index);
            $gamePlayer._followers._data[new_index]._x = $gamePlayer._x;
            $gamePlayer._followers._data[new_index]._realX = $gamePlayer._realX;
            $gamePlayer._followers._data[new_index]._y = $gamePlayer._y;
            $gamePlayer._followers._data[new_index]._realY = $gamePlayer._realY;
        }

    });

    this.extend(Game_Follower, "update", function () {

        if ($applyToChar_OC) { // If apply char is set do not update input
            Game_Character.prototype.update.call(this); return;
        }

        if (!this.isVisible()) return;

        if (this._playerIndex_OC > 0) {
            var wasMoving = this.isMoving();
            Game_Character.prototype.update.call(this);
            //this.setMoveSpeed($gamePlayer.realMoveSpeed());
            if ($gamePlayer._blinkCount < 1) this.setOpacity($gamePlayer.opacity());
            this.setBlendMode($gamePlayer.blendMode());
            this.setWalkAnime(true);
            this.setThrough($gamePlayer.isThrough() || $gamePlayer.areFollowersGathering());
            this.setStepAnime($gamePlayer.hasStepAnime());
            this.setDirectionFix($gamePlayer.isDirectionFixed());
            this.setTransparent($gamePlayer.isTransparent());
            if (!this.isMoving()) {
                this.updateNonmoving(wasMoving);
            } if (_useSlipperyTiles) {
                this.updateSlippery();
            } else {
                this._dashing = (this._shiftIsPressed); this.moveByInput();
            }
        } else { // "NPC" followers
            if ($gamePlayer._blinkCount > 0) {
                var old_opa = this._opacity;
                _this["Game_Follower_update"].apply(this, arguments);
                this.setOpacity(old_opa);
            } else {
                _this["Game_Follower_update"].apply(this, arguments);
            }
        }

    });

    this.extend(Game_Followers, "gather", function () {

        var allNearZero = true;
        var use_fade = _playerCount > 1 && $gamePlayer._followers.visibleFollowers().length > 0;

        for (var i = 0; i < $gamePlayer._followers._data.length; i++) {
            if ($gamePlayer._followers._data[i].isVisible()) {
                if (!numberNearZero($gamePlayer._x - $gamePlayer._followers._data[i]._x)) allNearZero = false;
                if (!numberNearZero($gamePlayer._y - $gamePlayer._followers._data[i]._y)) allNearZero = false;
            }
        }

        if (use_fade) use_fade = use_fade && !allNearZero;

        if (use_fade) {

            $gamePlayer._followers._gathering = true; _isFading = true;

            $gameScreen.startFadeOut(24); // If this is changed remember timeouts also

            var this_tmp_obj = null;

            if ($tempGamePlayer_OC != null) this_tmp_obj = $tempGamePlayer_OC;

            setTimeout(function () { // Wait for fade out

                if (this_tmp_obj != null) {
                    $gamePlayer._x = this_tmp_obj._x;
                    $gamePlayer._y = this_tmp_obj._y;
                    $gamePlayer._realX = this_tmp_obj._realX;
                    $gamePlayer._realY = this_tmp_obj._realY;
                }

                for (var i = 0; i < $gamePlayer._followers._data.length; i++) {
                    $gamePlayer._followers._data[i]._x = $gamePlayer._x;
                    $gamePlayer._followers._data[i]._y = $gamePlayer._y;
                    $gamePlayer._followers._data[i]._realX = $gamePlayer._realX;
                    $gamePlayer._followers._data[i]._realY = $gamePlayer._realY;
                }

                $gameScreen.startFadeIn(24);
                _this["Game_Followers_gather"].apply(this, arguments);

            }, 800);

            setTimeout(function () { // Wait for fade in
                $gamePlayer._followers._gathering = false; _canMove = true; _isFading = false;
            }, 1000);

        } else {
            _this["Game_Followers_gather"].apply(this, arguments);
        }

    });

    // Make event to turn to player who started event
    this.extend(Game_Character, "turnTowardPlayer", function () {
        _this.debug("turnTowardPlayer", $tempGamePlayer_OC);
        if ($tempGamePlayer_OC != null) {
            this.turnTowardCharacter($tempGamePlayer_OC);
        } else {
            _this["Game_Character_turnTowardPlayer"].apply(this, arguments);
        }
    });

    this.extend(Game_Player, "canMove", function () {
        if (!_canMove) return false;
        return _this["Game_Player_canMove"].apply(this, arguments);
    });

    // Enable choices / shop only for player in turn
    this.extend(Window_Selectable, "update", function () {
        if (_playerDevices[_playerInTurn] == -1) {
            _this["Window_Selectable_update"].apply(this, arguments);
        } else {
            Window_Base.prototype.update.call(this);
            this.updateArrows();
            this.processCursorMove();
            this.processHandling();
            this._stayCount++;
        }
    });

    // Is there player comment, if found >> is it for player 1?
    this.extend(Game_Player, "startMapEvent", function (x, y, triggers, normal) {
        setPlayerInTurnVar(_currentPlayer); $tempGamePlayer_OC = null;
        _this["Game_Player_startMapEvent"].apply(this, arguments);
    });

    // Olivia victory sequence fix for getting double aftermath
    if (Imported.Olivia_OctoBattle) {
        this.extend(BattleManager, "processVictory", function () {
            if (!_oliviaMustStart) { _oliviaMustStart = true; return; }
            _oliviaMustStart = false; _this["BattleManager_processVictory"].apply(this, arguments);
        });
    }

    // ------------------------------------------------------------------------------
    // RMMV core - Game_CharacterBase & Game_Player - New methods
    // ==============================================================================

    Game_Follower.prototype.isDashing = function () {
        return this._dashing;
    };

    Game_CharacterBase.prototype.isFollower_OC = function () { return false; };
    Game_CharacterBase.prototype.isPlayer_OC = function () { return false; };
    Game_Player.prototype.isPlayer_OC = function () { return true; };

    // If gather has been triggered by another player than P1
    Game_Player.prototype.chaseCharacter = function (character) {
        if (character._x > this._x) this.setDirection(6);
        if (character._x < this._x) this.setDirection(4);
        if (character._y > this._y) this.setDirection(2);
        if (character._y < this._y) this.setDirection(8);
        this._x = character._x; this._y = character._y;
    };

    // Yanfly region restriction compatibility
    Game_Follower.prototype.isPlayer = function () { return true; };

    // ------------------------------------------------------------------------------
    // RMMV core - Game_Follower - New methods
    // ==============================================================================

    if (Imported['VE - Diagonal Movement']) {
        this.debug("VE_DiagonalMovement", "Enabled!");
    } else {
        this.debug("VE_DiagonalMovement", "NOT found!");
        Game_Player.prototype.isDiagonalEnabled = function () { return false; };
    }

    // Get actor id which started the event
    Game_Map.prototype.currentActorId = function () {
        if ($tempGamePlayer_OC) {
            return $tempGamePlayer_OC.actor()._actorId;
        } else {
            return $gameParty.leader().actorId();
        }
    };

    // Methods for actor toggling
    Game_Map.prototype.focusToNextActor = function (input_from) {
        this.togglePlayer(false, input_from);
    };

    Game_Map.prototype.focusToPreviousActor = function (input_from) {
        this.togglePlayer(true, input_from);
    };

    Game_Character.prototype.startToBlink_OC = function () {
        if (_blinkHandle) clearTimeout(_blinkHandle);
        this._blinkCount = 2; this.doBlink_OC();
    };

    Game_Character.prototype.doBlink_OC = function () {

        this._blinkCount++; var tc = this;

        if (this._blinkCount < 10) {
            _blinkHandle = setTimeout(function () {
                if (tc._blinkCount % 2) {
                    tc._opacity = _blinkOpacity;
                } else {
                    tc._opacity = 255;
                } tc.doBlink_OC();
            }, _blinkTime);
        } else {
            tc._opacity = 255; tc._blinkCount = 0;
        }

    };

    Game_Map.prototype.togglePlayer = function (invert, input_from) {

        if (_useSlipperyTiles && $gamePlayer.onSlipperyFloor()) return;

        if ($gameParty.inBattle() || $gameMessage.isBusy() || _this._menuCalled || !_allowTogling) return;
        if ((1 != getDevicePlayer(input_from)) && !_allowToggleForAll) return;
        if (_cfTimeoutHandle) clearTimeout(_cfTimeoutHandle);
        if ($gamePlayer._followers.visibleFollowers().length < 1) return;

        if (invert) {

            _currentPlayer = _currentPlayer - 1; if (_currentPlayer < 1) _currentPlayer = _playerCount;

            if ($gamePlayer._followers.visibleFollowers()[2]) {
                $gameParty.swapOrder(3, 2);
                if (_playerCount > 3) swapPlayers(3, 2);
                if (_playerCount > 2) swapPlayers(2, 1);
                if (_playerCount > 1) swapPlayers(1, 0);
                $gamePlayer._followers.visibleFollowers()[2].swap_OC($gamePlayer._followers.visibleFollowers()[1]);
            } else {
                if (_playerCount > 3) swapPlayers(3, 2);
                if (_playerCount > 2) swapPlayers(2, 1);
                if (_playerCount > 1) swapPlayers(1, 0);
            }

            if ($gamePlayer._followers.visibleFollowers()[1]) {
                $gameParty.swapOrder(2, 1);
                $gamePlayer._followers.visibleFollowers()[1].swap_OC($gamePlayer._followers.visibleFollowers()[0]);
            }

            if ($gamePlayer._followers.visibleFollowers()[0]) {
                $gameParty.swapOrder(1, 0);
                $gamePlayer._followers.visibleFollowers()[0].swap_OC($gamePlayer);
            }

        } else {

            _currentPlayer = _currentPlayer + 1; if (_currentPlayer > _playerCount) _currentPlayer = 1;

            if ($gamePlayer._followers.visibleFollowers()[0]) {
                $gameParty.swapOrder(0, 1);
                if (_playerCount > 1) swapPlayers(0, 1);
                if (_playerCount > 2) swapPlayers(1, 2);
                if (_playerCount > 3) swapPlayers(2, 3);
                $gamePlayer.swap_OC($gamePlayer._followers.visibleFollowers()[0]);
            } else {
                if (_playerCount > 1) swapPlayers(0, 1);
                if (_playerCount > 2) swapPlayers(1, 2);
                if (_playerCount > 3) swapPlayers(2, 3);
            }

            if ($gamePlayer._followers.visibleFollowers()[1]) {
                $gameParty.swapOrder(1, 2);
                $gamePlayer._followers.visibleFollowers()[0].swap_OC($gamePlayer._followers.visibleFollowers()[1]);
            }

            if ($gamePlayer._followers.visibleFollowers()[2]) {
                $gameParty.swapOrder(2, 3);
                $gamePlayer._followers.visibleFollowers()[1].swap_OC($gamePlayer._followers.visibleFollowers()[2]);
            }
            

        }

        if (_playerCount > 1) {
            showTextOnScreen("Player " + _currentPlayer + " turn!", true);
            if (_followersFollow) {
                var do_gather = false;
                if (Math.abs($gamePlayer._x - $gamePlayer._followers.visibleFollowers()[0]._x) > 2) do_gather = true;
                if (Math.abs($gamePlayer._y - $gamePlayer._followers.visibleFollowers()[0]._y) > 2) do_gather = true;
                if (do_gather) { // Gather followers if they are following and they are too far away...
                    $gamePlayer._followers.visibleFollowers().forEach(function (f) {
                        if (!f._deviceIndex_OC) f.locate($gamePlayer._x, $gamePlayer._y);
                    });
                }
            }
        }

        $gamePlayer.startToBlink_OC();

    };

    Game_Character.prototype.swap_OC = function (character) {

        var newX = character.x; var newY = character.y;
        var old_dir = character._direction; var old_dir2 = this._direction;

        character.locate_OC(this.x, this.y); this.locate_OC(newX, newY);
        character.setDirection(old_dir2); this.setDirection(old_dir);

    };

    Game_Character.prototype.locate_OC = function (x, y) {
        Game_Character.prototype.locate.call(this, x, y);
    };

    Game_Player.prototype.locate_OC = function (x, y) {
        _screenHeight = Graphics.height / $gameMap.tileHeight();
        _screenWidth = Graphics.width / $gameMap.tileWidth();
        Game_Character.prototype.locate.call(this, x, y); this.center_OC();
    };

    Game_Map.prototype.findDirectionFromTo = function (start_x, end_x, start_y, end_y) {
        var deltaX1 = $gameMap.deltaX(end_x, start_x);
        var deltaY1 = $gameMap.deltaY(end_y, start_y);
        if (deltaY1 > 0) {
            //if (deltaX1 < 0) return 1;
            //if (deltaX1 > 0) return 3;
            return 2;
        } else if (deltaX1 < 0) {
            //if (deltaY1 < 0) return 7;
            return 4;
        } else if (deltaX1 > 0) {
            //if (deltaY1 < 0) return 9;
            return 6;
        } else if (deltaY1 < 0) {
            return 8;
        }
    };

    Game_Player.prototype.center_OC = function () {

        var tc = this;

        if ($gameMap.isScrolling()) {
            _cfTimeoutHandle = setTimeout(function () {
                tc.center_OC(); // Animate camera focus
            }, 17); return;
        }

        var targetX = this._x - this.centerX();
        var targetY = this._y - this.centerY();

        if (targetX < -1) targetX = -1;
        if (targetX > ($gameMap.width() - _screenWidth)) targetX = ($gameMap.width() - _screenWidth);
        if (targetY < -1) targetY = -1;
        if (targetY > ($gameMap.height() - _screenHeight)) targetY = ($gameMap.height() - _screenHeight);

        var newX = targetX;
        if ($gameMap._displayX > targetX) newX = $gameMap._displayX - 1;
        if ($gameMap._displayX < targetX) newX = $gameMap._displayX + 1;
 
        var newY = targetY;
        if ($gameMap._displayY > targetY) newY = $gameMap._displayY - 1;
        if ($gameMap._displayY < targetY) newY = $gameMap._displayY + 1;

        var dir_to = $gameMap.findDirectionFromTo(newX, targetX, newY, targetY);

        if (Math.abs(targetY - newY) < 1 && Math.abs(targetY - newY) < 1) {
            $gameMap.startScroll(dir_to, 1, 8);
            _this.debug("CAMERA FOCUS DONE!", this); return;
        }

        if (dir_to) {
            $gameMap.startScroll(dir_to, 1, 8);
        } else {
            _this.debug("CAMERA FOCUS DONE!", this); return;
        }

        _cfTimeoutHandle = setTimeout(function () {
            tc.center_OC(); // Animate camera focus
        }, 17);

    };

    // Yanfly slippery tiles
    if (_useSlipperyTiles) {

        var OC_Game_Follower_isDashing = Game_Follower.prototype.isDashing;
        Game_Follower.prototype.isDashing = function () {
            if (this._playerIndex_OC > 0) {
                if (this.onSlipperyFloor()) {
                    this._dashing = false; return false;
                }
            } return OC_Game_Follower_isDashing.call(this);
        };

        Game_Follower.prototype.updateSlippery = function () {
            if ($gameMap.isEventRunning()) return;
            if (this.onSlipperyFloor() && !(this._realX != this._x || this._realY != this._y) && this.canPass(this._x, this._y, this._direction)) {
                this._dashing = false;
                $gameTemp.clearDestination();
                this.moveStraight(this._direction);
            } else {
                this._dashing = (this._shiftIsPressed);
                this.moveByInput();
            }
        };

    }

    Game_Follower.prototype.isOnDamageFloor = function () {
        return $gameMap.isDamageFloor(this.x, this.y) && !this.isInAirship();
    };

    Game_Follower.prototype.isInAirship = function () {
        return $gamePlayer.isInAirship();
    };

    Game_Follower.prototype.isFollower_OC = function () { return true; };

    if (Imported.OcRam_Passages) {

        Game_Follower.prototype.startMapEvent = function (x, y, triggers, normal) {
            if (!$gameMap.isEventRunning()) {
                var ev_cmts = []; var trigger_always = false; var this_hl = (this !== undefined) ? this._higherLevel : false;
                setPlayerInTurnVar(getActualPlayer(this._playerIndex_OC));
                var evts = $gameMap.eventsXy(x, y);
                if (evts.length > 0) {
                    var self = this;
                    $gameMap.eventsXy(x, y).forEach(function (event) {
                        if (event.isTriggerIn(triggers) && event.isNormalPriority() === normal) {
                            ev_cmts = getEventComments(event); trigger_always = false;
                            for (var i = 0; i < ev_cmts.length; i++) {
                                if (ev_cmts[i] == "<trigger_always>") { trigger_always = true; }
                            } if (event._higherLevel == this_hl || trigger_always) {
                                var list = event.list();
                                if (list && list.length > 1) {
                                    self._preventNextOk = true;
                                    $gameTemp.clearDestination2();
                                    $tempGamePlayer_OC = self; // Object where event turns to
                                    _playerInTurn = self._playerIndex_OC;
                                    Input.clearAll(self); event.start();
                                }
                            }
                        }
                    });
                }
            }
        };

    } else {

        Game_Follower.prototype.startMapEvent = function (x, y, triggers, normal) {
            if (!$gameMap.isEventRunning()) {
                setPlayerInTurnVar(getActualPlayer(this._playerIndex_OC));
                var evts = $gameMap.eventsXy(x, y);
                if (evts.length > 0) {
                    var self = this;
                    $gameMap.eventsXy(x, y).forEach(function (event) {
                        if (event.isTriggerIn(triggers) && event.isNormalPriority() === normal) {
                            var list = event.list();
                            if (list && list.length > 1) {
                                self._preventNextOk = true;
                                $tempGamePlayer_OC = self; // Object where event turns to
                                _playerInTurn = self._playerIndex_OC;
                                Input.clearAll(self); event.start();
                            }
                        }
                    });
                }
            }
        };

    }

    Input.clearAll = function (pFollower) {
        _canMove = false;
        pFollower.dir4_OC = 0; pFollower.dir8_OC = 0;
        pFollower._okIsPressed = false;
        TouchInput._mousePressed2 = false;
        TouchInput._mousePressed = false;
        this._currentState = {};
        this._currentState2 = {};
        this._previousState = {};
        this._gamepadStates = [];
        this._latestButton = null;
        this._pressedTime = 0;
        this._dir4 = 0;
        this._dir8 = 0;
        this._preferredAxis = '';
        this._date = 0;
    };

    // Move follower by input
    Game_Follower.prototype.moveByInput = function () {

        if (this._deviceIndex_OC == -1) {

            // This followers is controlled via kb or mouse

            if (!this.isMoving() && this.canMove()) {

                var direction = this.getInputDirection();
                if (direction > 0) {
                    $gameTemp.clearDestination2();
                } else if ($gameTemp.isDestinationValid2()) {
                    var x = $gameTemp.destinationX2();
                    var y = $gameTemp.destinationY2();
                    direction = this.findDirectionTo(x, y);
                }

                if (direction > 0) {
                    this.executeMove(direction);
                    if (!this.isMovementSucceeded()) $gameTemp.clearDestination2();
                } else { // Reached destination
                    $gameTemp.clearDestination2();
                }

            }

        } else {

            // This followers is controlled via gamepad
            if (!this.isMoving() && this.canMove()) {
                var direction = this.getInputDirection();
                if (direction > 0) this.executeMove(direction);
            }

        }

    };

    // Move follower by input (from kb, mouse or gamepad)
    Game_Follower.prototype.executeMove = function (direction) {
        if (direction % 2 !== 0) {
            this._diagonal = direction;
            this.diagonalMovement(direction);
            if (this.needDiagonalFix()) this.diagonalMovementFix(direction);
        } else {
            this._diagonal = 0;
            this.moveStraight(direction);
        };
    };

    // Get direction from input (from kb, mouse or gamepad)
    Game_Follower.prototype.getInputDirection = function () {

        var ret = $gamePlayer.isDiagonalEnabled() ? this.dir8_OC : this.dir4_OC;

        if (this._deviceIndex_OC == -1) {

            this._okIsPressed = Input.isPressed2('ok') && !this._preventNextOk;
            this._cancelIsPressed = Input.isPressed2('cancel');
            this._shiftIsPressed = TouchInput.isPressed2() || Input.isPressed2('shift');
            this._menuIsPressed = Input.isPressed2('menu');

            if (Input.isPressed2('up')) ret = 8;
            if (Input.isPressed2('left')) ret = 4;
            if (Input.isPressed2('down')) ret = 2;
            if (Input.isPressed2('right')) ret = 6;

        }

        if (this._okIsPressed && !this._preventNextOk) {
            this.checkEventTriggerHere([0]);
            this.checkEventTriggerThere([0, 1, 2]);
        }

        if (this._menuIsPressed) {
            _playerInTurn = this._playerIndex_OC;
            if (!$gameParty.inBattle()) {
                this._menuIsPressed = false;
                _this._menuCalled = true;
                Input.OC_resetControllers(true);
                SceneManager.push(Scene_Menu); _canMove = false;
                Window_MenuCommand.initCommandPosition();
            }
        }

        return ret;

    };

    Input.isPressedEX = function (playerIndex, key) {
        if (playerIndex == 0) { // P1 keyboard
            return this.isPressed(key);
        } else {
            if (_playerDevices[playerIndex] != null) {
                if (this._currentState2[_playerDevices[playerIndex]] != undefined) {
                    return this._currentState2[_playerDevices[playerIndex]][this.gamepadMapperInv[key]];
                } else {
                    return false;
                }
            } else {
                return false;
            }
        }
    };

    Game_Follower.prototype.canMove = function () {
        if ($gameMap.isEventRunning() || $gameMessage.isBusy()) {
            return false;
        }
        /*if (this.isMoveRouteForcing() || $gamePlayer.areFollowersGathering()) {
            return false;
        }
        if (this._vehicleGettingOn || this._vehicleGettingOff) {
            return false;
        }*/
        if ($gamePlayer.isInVehicle() && !$gamePlayer.vehicle().canMove()) {
            return false;
        }
        return _canMove;
    };

    Game_Follower.prototype.triggerAction = function () {
        if (this.canMove()) {
            if (this.triggerButtonAction()) {
                return true;
            }
            if (this.triggerTouchAction()) {
                return true;
            }
        }
        return false;
    };

    Game_Follower.prototype.triggerButtonAction = function () {
        if (this._okIsPressed && !this._preventNextOk) {
            /*if (this.getOnOffVehicle()) {
                return true;
            }*/
            this.checkEventTriggerHere([0]);
            if ($gameMap.setupStartingEvent()) {
                return true;
            }
            this.checkEventTriggerThere([0, 1, 2]);
            if ($gameMap.setupStartingEvent()) {
                return true;
            }
        }
        return false;
    };

    Game_Follower.prototype.triggerTouchAction = function () {
        if ($gameTemp.isDestinationValid2()) {
            var direction = this.direction();
            var x1 = this.x;
            var y1 = this.y;
            var x2 = $gameMap.roundXWithDirection(x1, direction);
            var y2 = $gameMap.roundYWithDirection(y1, direction);
            var x3 = $gameMap.roundXWithDirection(x2, direction);
            var y3 = $gameMap.roundYWithDirection(y2, direction);
            var destX = $gameTemp.destinationX2();
            var destY = $gameTemp.destinationY2();
            if (destX === x1 && destY === y1) {
                return this.triggerTouchActionD1(x1, y1);
            } else if (destX === x2 && destY === y2) {
                return this.triggerTouchActionD2(x2, y2);
            } else if (destX === x3 && destY === y3) {
                return this.triggerTouchActionD3(x2, y2);
            }
        }
        return false;
    };

    Game_Follower.prototype.triggerTouchActionD1 = function (x1, y1) {
        /*if ($gameMap.airship().pos(x1, y1)) {
            if (TouchInput.isTriggered() && this.getOnOffVehicle()) {
                return true;
            }
        }*/
        this.checkEventTriggerHere([0]);
        return $gameMap.setupStartingEvent();
    };

    Game_Follower.prototype.triggerTouchActionD2 = function (x2, y2) {

        /*if ($gameMap.boat().pos(x2, y2) || $gameMap.ship().pos(x2, y2)) {
            if (TouchInput.isTriggered() && this.getOnVehicle()) {
                return true;
            }
        }
        if (this.isInBoat() || this.isInShip()) {
            if (TouchInput.isTriggered() && this.getOffVehicle()) {
                return true;
            }
        }*/

        this.checkEventTriggerThere([0, 1, 2]);
        return $gameMap.setupStartingEvent();

    };

    Game_Follower.prototype.triggerTouchActionD3 = function (x2, y2) {
        if ($gameMap.isCounter(x2, y2)) this.checkEventTriggerThere([0, 1, 2]);
        return $gameMap.setupStartingEvent();
    };

    Game_Follower.prototype.updateNonmoving = function (wasMoving) {
        if (!$gameMap.isEventRunning()) {
            if (wasMoving) {
                //$gameParty.onPlayerWalk();
                this.checkEventTriggerHere([1, 2]);
                if ($gameMap.setupStartingEvent()) {
                    return;
                }
            }
            if (this.triggerAction()) {
                return;
            } //if (wasMoving) this.updateEncounterCount();
        }
    };

    Game_Follower.prototype.checkEventTriggerHere = function (triggers) {
        if ($gamePlayer.canStartLocalEvents()) {
            this.startMapEvent(this.x, this.y, triggers, false);
        }
    };
    
    Game_Follower.prototype.checkEventTriggerThere = function (triggers) {
        if ($gamePlayer.canStartLocalEvents()) {
            var direction = this.direction();
            var x1 = this.x;
            var y1 = this.y;
            var x2 = $gameMap.roundXWithDirection(x1, direction);
            var y2 = $gameMap.roundYWithDirection(y1, direction);
            this.startMapEvent(x2, y2, triggers, true);
            if (!$gameMap.isAnyEventStarting() && $gameMap.isCounter(x2, y2)) {
                var x3 = $gameMap.roundXWithDirection(x2, direction);
                var y3 = $gameMap.roundYWithDirection(y2, direction);
                this.startMapEvent(x3, y3, triggers, true);
            }
        }
    };

    Game_Character.prototype.getClosestPlayer = function () {
        var pd = Math.abs(this.x - $gamePlayer.x) + Math.abs(this.y - $gamePlayer.y);
        var o = $gamePlayer; var t = this;
        $gamePlayer._followers.visibleFollowers().forEach(function (follower) {
            if (follower._playerIndex_OC > 0 || !_followersFollow) {
                var tmp = Math.abs(t.x - follower.x) + Math.abs(t.y - follower.y);
                if (tmp < pd) { pd = tmp; o = follower; }
            }
        }); return o;
    };

    // ------------------------------------------------------------------------------
    // RMMV core - Game_Temp - New methods - To move followers via touch/mouse
    // ==============================================================================

    Game_Temp.prototype.setDestination2 = function (x, y) {
        this._destinationX2 = x;
        this._destinationY2 = y;
    };

    Game_Temp.prototype.clearDestination2 = function () {
        this._destinationX2 = null;
        this._destinationY2 = null;
    };

    Game_Temp.prototype.isDestinationValid2 = function () {
        return this._destinationX2 !== null;
    };

    Game_Temp.prototype.destinationX2 = function () {
        return this._destinationX2;
    };

    Game_Temp.prototype.destinationY2 = function () {
        return this._destinationY2;
    };

    Game_Player.prototype.isVisible = function () {
        return true;
    };

    Game_Temp._reservePlayerIndexJoined = 0;
    Game_Temp._reservePlayerIndexLeft = 0;

    // ------------------------------------------------------------------------------
    // RMMV core - Input and InputTouch - New methods
    // ==============================================================================

    Input.isPressed2 = function (keyName) {
        if (this._isEscapeCompatible(keyName) && this.isPressed2('escape')) {
            return true;
        } else {
            return !!this._currentState2[keyName];
        }
    };

    TouchInput.isPressed2 = function () {
        return this._mousePressed2;
    };

    Input.OC_resetControllers = function (clear_p1_also) {
        if ($gameTemp != null) $gameTemp.clearDestination2();
        this._currentState2 = {}; if (clear_p1_also) this.clear();
    };

    // New method where dir-pad is enabled
    Input._updateGamepadState_OC = function (gamepad, player_idx) {

        var lastState = this._gamepadStates[gamepad.index] || [];
        var newState = [];
        var buttons = gamepad.buttons;
        var axes = gamepad.axes;
        var threshold = 0.5;

        newState[12] = false;
        newState[13] = false;
        newState[14] = false;
        newState[15] = false;

        var d_pad = axes[axes.length - 1]; var d_pad_used = false;

        if (d_pad >= -1 && d_pad < 0.72) { /* D-Pad */
            if (d_pad == -1) { newState[12] = true; d_pad_used = true; } // up
            if (d_pad == -0.4285714030265808) { newState[15] = true; d_pad_used = true; } // right
            if (d_pad == 0.14285719394683838) { newState[13] = true; d_pad_used = true; } // down
            if (d_pad == 0.7142857313156128) { newState[14] = true; d_pad_used = true; } // left
        }

        for (var i = 0; i < buttons.length; i++) {
            newState[i] = buttons[i].pressed;
        }

        if (axes[1] < -threshold) {
            newState[12] = true;    // up
        } else if (axes[1] > threshold) {
            newState[13] = true;    // down
        }

        if (axes[0] < -threshold) {
            newState[14] = true;    // left
        } else if (axes[0] > threshold) {
            newState[15] = true;    // right
        }

        for (var j = 0; j < newState.length; j++) {
            if (newState[j] !== lastState[j]) {
                var buttonName = this.gamepadMapper[j];
                if (buttonName) {
                    this._currentState[buttonName] = newState[j];
                }
            }
        }

        if (newState[4] && !lastState[4] && $gameMap._mapId) $gameMap.focusToPreviousActor(gamepad.index);
        if (newState[5] && !lastState[5] && $gameMap._mapId) $gameMap.focusToNextActor(gamepad.index);

        this._gamepadStates[gamepad.index] = newState;

    };

    // New method to control follower and where dir-pad is enabled
    Input._updateGamepadState2_OC = function (gamepad, player_idx) {

        var p_follower = $allPlayers[player_idx - 1];

        if (p_follower == null) return;

        var lastState = this._OC_gamepadStates[gamepad.index] || [];
        var newState = [];
        var buttons = gamepad.buttons;
        var axes = gamepad.axes;
        var threshold = 0.5;

        newState[12] = false;
        newState[13] = false;
        newState[14] = false;
        newState[15] = false;

        var d_pad = axes[axes.length - 1]; var d_pad_used = false;
        if (d_pad >= -1 && d_pad < 0.72) { /* D-Pad */
            if (d_pad == -1) { newState[12] = true; d_pad_used = true; } // up
            if (d_pad == -0.4285714030265808) { newState[15] = true; d_pad_used = true; } // right
            if (d_pad == 0.14285719394683838) { newState[13] = true; d_pad_used = true; } // down
            if (d_pad == 0.7142857313156128) { newState[14] = true; d_pad_used = true; } // left
        }

        for (var i = 0; i < buttons.length; i++) {
            newState[i] = buttons[i].pressed;
        }

        if (!d_pad_used) {

            if (axes[1] < -threshold) {
                newState[12] = true; // up
            } else if (axes[1] > threshold) {
                newState[13] = true; // down
            }

            if (axes[0] < -threshold) {
                newState[14] = true; // left
            } else if (axes[0] > threshold) {
                newState[15] = true; // right
            }

        }

        this._currentState2[gamepad.index] = newState;
        this._OC_gamepadStates[gamepad.index] = newState;

        if ($tempGamePlayer_OC == null && !d_pad_used) {
            if (!(buttons[0].pressed)) p_follower._preventNextOk = false;
            if (!(p_follower._preventNextOk)) p_follower._okIsPressed = buttons[0].pressed;
            p_follower._cancelIsPressed = buttons[1].pressed;
            p_follower._shiftIsPressed = buttons[2].pressed;
            p_follower._menuIsPressed = buttons[3].pressed;
        }

        if (newState[4] && !lastState[4] && $gameMap._mapId) $gameMap.focusToPreviousActor(gamepad.index);
        if (newState[5] && !lastState[5] && $gameMap._mapId) $gameMap.focusToNextActor(gamepad.index);

        updateDirs(p_follower, newState);

    };

    // ------------------------------------------------------------------------------
    // Apply to char - Overrides
    // ==============================================================================

    // Set Movement Route
    Game_Interpreter.prototype.command205 = function () {
        $gameMap.refreshIfNeeded();
        this._character = $applyToChar_OC == null ? this.character(this._params[0]) : $applyToChar_OC;
        if (this._character) {
            this._character.forceMoveRoute(this._params[1]);
            if (this._params[1].wait) {
                this.setWaitMode('route');
            }
        }
        return true;
    };

    // Show Animation
    Game_Interpreter.prototype.command212 = function () {
        this._character = $applyToChar_OC == null ? this.character(this._params[0]) : $applyToChar_OC;
        if (this._character) {
            this._character.requestAnimation(this._params[1]);
            if (this._params[2]) {
                this.setWaitMode('animation');
            }
        } return true;
    };

    // Show Balloon Icon
    Game_Interpreter.prototype.command213 = function () {
        this._character = $applyToChar_OC == null ? this.character(this._params[0]) : $applyToChar_OC;
        if (this._character) {
            this._character.requestBalloon(this._params[1]);
            if (this._params[2]) {
                this.setWaitMode('balloon');
            }
        }
        return true;
    };

    // ------------------------------------------------------------------------------
    // Yanfly - Event chase - Overrides
    // ==============================================================================

    Game_Event.prototype.updateChaseMovement = function () {

        if (this._staggerCount > 0) {
            return this._staggerCount--;
        }
        if (this._stopCount > 0 && this._chasePlayer) {
            var nearest_player = this.getClosestPlayer();
            var direction = this.findDirectionTo(nearest_player.x, nearest_player.y);
            if (direction > 0) {
                var x = this._x;
                var y = this._y;
                this.moveStraight(direction);
                if (x === this._x && y === this._y) this._staggerCount = 20;
            }
        } else if (this._stopCount > 0 && this._fleePlayer) {
            this.updateFleeMovement();
        } else if (this._returnPhase) {
            this.updateMoveReturnAfter();
        } else {
            Yanfly.ECP.Game_Event_updateSelfMovement.call(this);
        }

    };

    Game_Event.prototype.updateFleeDistance = function () {

        if (this._erased) return;
        if (this._fleeRange <= 0) return;

        var nearest_player = this.getClosestPlayer();
        var dis = Math.abs(this.deltaXFrom(nearest_player.x));
        dis += Math.abs(this.deltaYFrom(nearest_player.y));

        if (this.fleeConditions(dis)) {
            this.startEventFlee();
        } else if (this._fleePlayer) {
            this.endEventFlee();
        }

    };

    Game_Event.prototype.canSeePlayer = function () {

        if (!this._seePlayer) return false;

        var nearest_player = this.getClosestPlayer();
        var sx = this.deltaXFrom(nearest_player.x);
        var sy = this.deltaYFrom(nearest_player.y);

        if (Math.abs(sx) > Math.abs(sy)) {
            var direction = (sx > 0) ? 4 : 6;
        } else {
            var direction = (sy > 0) ? 8 : 2;
        }

        if (direction === this.direction()) {
            this._alertLock = this._sightLock;
            return true;
        }

        return false;

    };

    Game_Event.prototype.updateChaseDistance = function () {

        if (this._erased) return;
        if (this._chaseRange <= 0) return;

        var nearest_player = this.getClosestPlayer();
        var dis = Math.abs(this.deltaXFrom(nearest_player.x));
        dis += Math.abs(this.deltaYFrom(nearest_player.y));

        if (this.chaseConditions(dis)) {
            this.startEventChase();
        } else if (this._chasePlayer) {
            this.endEventChase();
        }

    };

    Game_Follower.prototype.checkEventTriggerTouch = function (x, y) {
        if ($gamePlayer.canStartLocalEvents()) {
            this.startMapEvent(x, y, [1, 2], true);
        }
    };

    // ------------------------------------------------------------------------------
    // RMMV core - Overrides
    // ==============================================================================
    Game_Event.prototype.checkEventTriggerTouch = function (x, y) {
        if (!$gameMap.isEventRunning()) {
            if (this._trigger === 2) {
                if ($gamePlayer.pos(x, y)) {
                    if (!this.isJumping()) {
                        this.start();
                    }
                } else {
                    const f = OcRam.followers().find(f => {
                        return f._deviceIndex_OC && f.pos(x, y);
                    }); if (f) this.start();
                }
            }
        }
    };

    Game_Character.prototype.turnTowardPlayer = function () {
        if ($tempGamePlayer_OC) {
            this.turnTowardCharacter($tempGamePlayer_OC);
        } else {
            this.turnTowardCharacter(this.getClosestPlayer());
        }
    };

    Game_Character.prototype.turnAwayFromPlayer = function () {
        this.turnAwayFromCharacter(this.getClosestPlayer());
    };

    Game_Character.prototype.moveTowardPlayer = function () {
        this.moveTowardCharacter(this.getClosestPlayer());
    };

    Game_Character.prototype.moveAwayFromPlayer = function () {
        this.moveAwayFromCharacter(this.getClosestPlayer());
    };

    // Check input for P1, if not present check followers
    Scene_Map.prototype.processMapTouch = function () {

        if (TouchInput.isTriggered() || this._touchCount > 0) {

            if (TouchInput.isPressed()) {

                if (this._touchCount === 0 || this._touchCount >= 15) {
                    var x = $gameMap.canvasToMapX(TouchInput.x);
                    var y = $gameMap.canvasToMapY(TouchInput.y);
                    $gameTemp.setDestination(x, y);
                }

                this._touchCount++;

            } else {

                if (TouchInput.isPressed2()) {
                    var x = $gameMap.canvasToMapX(TouchInput.x2);
                    var y = $gameMap.canvasToMapY(TouchInput.y2);
                    $gameTemp.setDestination2(x, y);
                } else {
                    this._touchCount = 0;
                }

            }

        }

    };

    Input._updateGamepadState = function (gamepad) {

        var buttons = gamepad.buttons; // Always listen to start / select buttons

        if (buttons[_playerDropButton]) {
            if (buttons[_playerDropButton].pressed) {
                if (_playerDropConfirmButton == 0) {
                    dropDevice(gamepad.index);
                } else {
                    if (buttons[_playerDropConfirmButton].pressed) dropDevice(gamepad.index);
                }
            } else {
                if (buttons[_playerJoinButton].pressed) assignDevice(gamepad.index);
            }
        }

        var player_idx = getDevicePlayer(gamepad.index); // To whom this device belongs to?

        if (_playerDevices[_playerInTurn] == gamepad.index || (player_idx == -1 && _playerInTurn == 0)) {
            this._updateGamepadState_OC(gamepad, player_idx);
        } else {
            if (!_partyInBattle) { // Update other gamepads only on Map_Scene (if this player not in turn)
                this._updateGamepadState2_OC(gamepad, player_idx);
            }
        }

    };

    // Update follower move only on NOT signed members and special cases for gather (with and without fade)
    Game_Followers.prototype.updateMove = function () {
        if (!_followersFollow) return;
        var precedingCharacter = $gamePlayer;
        if (this.areGathering()) {
            if (!_isFading) {
                if ($tempGamePlayer_OC != null) {
                    precedingCharacter = $tempGamePlayer_OC;
                    $gamePlayer.chaseCharacter(precedingCharacter);
                    for (var i = this._data.length - 1; i >= 0; i--) {
                        if (this._data[i]._playerIndex_OC != $tempGamePlayer_OC._playerIndex_OC)
                            this._data[i].chaseCharacter(precedingCharacter);
                    }
                } else {
                    for (var i = this._data.length - 1; i >= 0; i--) {
                        this._data[i].chaseCharacter(precedingCharacter);
                    }
                }
            }
        } else {
            for (var i = _membersNotSigned.length - 1; i >= 0; i--) {
                precedingCharacter = (i > 0) ? _membersNotSigned[i - 1] : $gamePlayer;
                _membersNotSigned[i].chaseCharacter(precedingCharacter);
            }
        }
    };

    // ------------------------------------------------------------------------------
    // Utility functions
    // ==============================================================================

    // Set and ensure that player in turn variable has been set
    function setPlayerInTurnVar(player_in_turn) {
        if (_playerInTurnVarId > 0) {
            $gameVariables.setValue(_playerInTurnVarId, player_in_turn);
        }
    }

    // Get actual play in turn (on world map) - Keep orginal players as they are...
    function getActualPlayer(orginal_index) {
        var act_curpla = (orginal_index) + 1;
        if (_playerCount == 2) { // Two players
            if (_currentPlayer == 2 && act_curpla == 2) act_curpla = 1;
        } else if (_playerCount == 3) { // Three players
            if (_currentPlayer == 2) {
                if (act_curpla == 3) act_curpla = 1;
                if (act_curpla == 2) act_curpla = 3;
            } else if (_currentPlayer == 3) {
                if (act_curpla == 2) act_curpla = 1;
                if (act_curpla == 3) act_curpla = 2;
            }
        } else if (_playerCount == 4) { // Four players
            if (_currentPlayer == 2) {
                if (act_curpla == 4) act_curpla = 1;
                if (act_curpla == 3) act_curpla = 4;
                if (act_curpla == 2) act_curpla = 3;
            } else if (_currentPlayer == 3) {
                if (act_curpla == 2) {
                    act_curpla = 4;
                } else if (act_curpla == 4) {
                    act_curpla = 2;
                } if (act_curpla == 3) act_curpla = 1;
            } else if (_currentPlayer == 4) {
                if (act_curpla == 2) act_curpla = 1;
                if (act_curpla == 3) act_curpla = 2;
                if (act_curpla == 4) act_curpla = 3;
            }
        } return act_curpla;
    }

    // Update directions for desired player
    function updateDirs(p_follower, current_state) {

        var dir = 0;

        // Main directions
        if (current_state[12]) dir = 8;
        if (current_state[13]) dir = 2;
        if (current_state[14]) dir = 4;
        if (current_state[15]) dir = 6;
        setDir4(p_follower, dir);

        // Diagonal directions
        if (current_state[12] && current_state[14]) dir = 7;
        if (current_state[12] && current_state[15]) dir = 9;
        if (current_state[13] && current_state[14]) dir = 1;
        if (current_state[13] && current_state[15]) dir = 3;
        setDir8(p_follower, dir);

    }

    // This function is used in battle to get player in turn based on actor index
    function getPlayerInTurn(actor_in_turn, shuffle_turns) {

        var pt_tester = 0; // To prevent false positive on gamepad update

        if (actor_in_turn > -1) {
            if (_playerCount == 2) {
                if ($gameParty._actors.length == 3) {
                    if (actor_in_turn == 2) {
                        pt_tester = _turnShufler; // Shuffle (3 member party, 3rd member) on two player mode
                    } else {
                        pt_tester = (_playerDevices[actor_in_turn] != null) ? actor_in_turn : 0;
                    }
                } else {
                    if (actor_in_turn == 3) {
                        pt_tester = 1; // 4th member to P2 if full party
                    } else {
                        pt_tester = (_playerDevices[actor_in_turn] != null) ? actor_in_turn : 0;
                    }
                }
            } else {
                if (_playerCount == 3 && actor_in_turn == 3) {
                    if (shuffle_turns) _turnShufler = (_turnShufler + 1) % 3;
                    pt_tester = _turnShufler;
                } else {
                    pt_tester = (_playerDevices[actor_in_turn] != null) ? actor_in_turn : 0;
                }
            }
        } else {
            pt_tester = 0;
        }

        // Try all in case player has been dropped from middle
        if (_playerDevices[pt_tester] == null) pt_tester = (pt_tester + 1) % 4;
        if (_playerDevices[pt_tester] == null) pt_tester = (pt_tester + 1) % 4;
        if (_playerDevices[pt_tester] == null) pt_tester = (pt_tester + 1) % 4;

        _playerInTurn = pt_tester; setPlayerInTurnVar(_playerInTurn + 1); 
        
    }

    // To whom this device belongs?
    function getDevicePlayer(device_index) {
        if (_playerDevices[0] == device_index) return 1;
        if (_playerDevices[1] == device_index) return 2;
        if (_playerDevices[2] == device_index) return 3;
        if (_playerDevices[3] == device_index) return 4;
        return -1;
    }

    // How many players there currently is?
    function getPlayerCount() {
        var p_count = 0;
        if (_playerDevices[0] != null) p_count++;
        if (_playerDevices[1] != null) p_count++;
        if (_playerDevices[2] != null) p_count++;
        if (_playerDevices[3] != null) p_count++;
        return p_count;
    }

    // Assign devices to followers, exclude P1 from this (it is not follower)
    function getAssignedFollowers() {

        if ($gamePlayer !== null) {

            $gamePlayer._followers._data[0]._playerIndex_OC = 0;
            $gamePlayer._followers._data[1]._playerIndex_OC = 0;
            $gamePlayer._followers._data[2]._playerIndex_OC = 0;
            $gamePlayer._followers._data[0]._deviceIndex_OC = 0;
            $gamePlayer._followers._data[1]._deviceIndex_OC = 0;
            $gamePlayer._followers._data[2]._deviceIndex_OC = 0;

            $allPlayers[1] = null; $allPlayers[2] = null; $allPlayers[3] = null;

            _membersNotSigned = [];

            if (_playerDevices[1] != null) {
                $gamePlayer._followers._data[0]._playerIndex_OC = 1;
                $gamePlayer._followers._data[0]._deviceIndex_OC = _playerDevices[1];
                $allPlayers[1] = $gamePlayer._followers._data[0];
            } else {
                _membersNotSigned.push($gamePlayer._followers._data[0]);
            }

            if (_playerDevices[2] != null) {
                $gamePlayer._followers._data[1]._playerIndex_OC = 2;
                $gamePlayer._followers._data[1]._deviceIndex_OC = _playerDevices[2];
                $allPlayers[2] = $gamePlayer._followers._data[1];
            } else {
                _membersNotSigned.push($gamePlayer._followers._data[1]);
            }

            if (_playerDevices[3] != null) {
                $gamePlayer._followers._data[2]._playerIndex_OC = 3;
                $gamePlayer._followers._data[2]._deviceIndex_OC = _playerDevices[3];
                $allPlayers[3] = $gamePlayer._followers._data[2];
            } else {
                _membersNotSigned.push($gamePlayer._followers._data[2]);
            }

        } Input.OC_resetControllers(true);

    }

    // Assign device and return zero based player index
    function assignDevice(device_index) {
        var player_index = getDevicePlayer(device_index); var try_index = 0;
        if (player_index < 0) {
            if (_maxNumberOfPlayers < (_playerCount + 1)) { _this.debug("Max number of players reached!", "No more players allowed!"); return -1; }
            if (_playerDevices[1] == null && !_joinSwitchValues[0] && try_index == 0) try_index = 1;
            if (_playerDevices[2] == null && !_joinSwitchValues[1] && try_index == 0) try_index = 2;
            if (_playerDevices[3] == null && !_joinSwitchValues[2] && try_index == 0) try_index = 3;
            if (try_index != 0) {
                _playerDevices[try_index] = device_index; showTextOnScreen("Player " + (try_index + 1) + " joined the game!");
                _playerCount = getPlayerCount(); _this.debug("Player count is now:", _playerCount);
                getAssignedFollowers(); if (_playerEnterCE > 0) $gameTemp.reserveCommonEvent(_playerEnterCE);
                $gameTemp._reservePlayerIndexJoined = try_index;
                return try_index;
            } else {
                _this.debug("No more player slots available for device index:", device_index); return -1;
            }
        } else {
            return player_index - 1;
        }
    }

    // Reset player toggling must be called when dropping off player...
    function resetPlayerToggle() {

        if (_currentPlayer == 1 || !$gameMap._mapId) return;
        $gameMap.focusToNextActor(_playerDevices[0]);
        if (_currentPlayer != 1) $gameMap.focusToNextActor(_playerDevices[0]);
        if (_currentPlayer != 1) $gameMap.focusToNextActor(_playerDevices[0]);
        _this.debug("resetPlayerToggle - Player in turn:", _currentPlayer);

    }

    // Drop 1 player starting from P4
    function dropPlayerStartingFromP4() {
        if (_playerDevices[3] != null) {
            dropDevice(_playerDevices[3]);
        } else {
            if (_playerDevices[2] != null) {
                dropDevice(_playerDevices[2]);
            } else {
                if (_playerDevices[1] != null) {
                    dropDevice(_playerDevices[1]);
                }
            }
        }
    }

    // Drop player and return zero based player index
    function dropDevice(device_index) {

        resetPlayerToggle();
        
        if (_playerDevices[1] == device_index) {
            if ($allPlayers[1] != null && _followersFollow) {
                $allPlayers[1]._x = $gamePlayer._x; $allPlayers[1]._realX = $gamePlayer._realX;
                $allPlayers[1]._y = $gamePlayer._y; $allPlayers[1]._realY = $gamePlayer._realY;
            } if (device_index < 0) { $gameTemp.clearDestination2(); _playerDevices[1] = -1; }
            _playerDevices[1] = null; showTextOnScreen("Player 2 left the game!");
            _playerCount = getPlayerCount(); _this.debug("Player count is now:", _playerCount);
            getAssignedFollowers(); if (_playerLeaveCE > 0) $gameTemp.reserveCommonEvent(_playerLeaveCE);
            $gameTemp._reservePlayerIndexLeft = 1; return 1;
        }

        if (_playerDevices[2] == device_index) {
            if ($allPlayers[2] != null && _followersFollow) {
                $allPlayers[2]._x = $gamePlayer._x; $allPlayers[2]._realX = $gamePlayer._realX;
                $allPlayers[2]._y = $gamePlayer._y; $allPlayers[2]._realY = $gamePlayer._realY;
            } if (device_index < 0) { $gameTemp.clearDestination2(); _playerDevices[1] = -1; }
            _playerDevices[2] = null; showTextOnScreen("Player 3 left the game!");
            _playerCount = getPlayerCount(); _this.debug("Player count is now ", _playerCount);
            getAssignedFollowers(); if (_playerLeaveCE > 0) $gameTemp.reserveCommonEvent(_playerLeaveCE);
            $gameTemp._reservePlayerIndexLeft = 2; return 2;
        }

        if (_playerDevices[3] == device_index) {
            if ($allPlayers[3] != null && _followersFollow) {
                $allPlayers[3]._x = $gamePlayer._x; $allPlayers[3]._realX = $gamePlayer._realX;
                $allPlayers[3]._y = $gamePlayer._y; $allPlayers[3]._realY = $gamePlayer._realY;
            } if (device_index < 0) { $gameTemp.clearDestination2(); _playerDevices[1] = -1; }
            _playerDevices[3] = null; showTextOnScreen("Player 4 left the game!");
            _playerCount = getPlayerCount(); _this.debug("Player count is now ", _playerCount);
            getAssignedFollowers(); if (_playerLeaveCE > 0) $gameTemp.reserveCommonEvent(_playerLeaveCE);
            $gameTemp._reservePlayerIndexLeft = 3; return 3;
        }

        return -1;

    }

    // This will make follower move
    function setDir4(follower_obj, dir) { follower_obj.dir4_OC = dir; }
    function setDir8(follower_obj, dir) { follower_obj.dir8_OC = dir; }

    // Assign actor X to player Y
    function assignActor(actor_id, player_index) {
        var actr_id = $gameParty.members().indexOf($gameActors.actor(actor_id));
        _this.debug("Assign actorId:" + actor_id + " to player index:" + player_index, "actr_id:" + actr_id);
        if (actr_id > -1) $gameParty.swapOrder(player_index, actr_id);
    }

    // For future update
    function showTextOnScreen(text_to_show, battle_msg) {

        if (!_showInfoText) return;

        if (_sceneTextLayer != null) {
            _sceneTextLayer._maxFrames = (battle_msg) ? (_textFadeTime * 0.666) : _textFadeTime;
            _sceneTextLayer._framesPreCalculated = _sceneTextLayer._maxFrames * 0.5;
            _sceneTextLayer.writeText(text_to_show);
        } _this.debug("showTextOnScreen", "('" + text_to_show + "')");

    }

    // Zero based player index as parameter
    function swapPlayers(p1, p2) {

        var p_tmp = _playerDevices[p1];
        _playerDevices[p1] = _playerDevices[p2];
        _playerDevices[p2] = p_tmp;
        Input.OC_resetControllers(true);
        getAssignedFollowers();
        _this.debug("Swapped players", p1 + " and " + p2);

    }

    // Returns all comments in array
    function getEventComments(ev) {
        if (ev === null || ev === undefined) {
            return [];
        } else {
            if (ev._erased != true && ev._pageIndex > -1) {
                var cmts = []; var ev_list = ev.list();
                for (var i = 0; i < ev_list.length; i++) {
                    if (ev_list[i].code == 108) { // we have a comment
                        for (var j = 0; j < ev_list[i].parameters.length; j++) {
                            if (ev_list[i].parameters[j] != null) cmts.push(ev_list[i].parameters[j]);
                        }
                    }
                } return cmts;
            } else {
                return [];
            }
        }
    }

    // Returns true if number between -2 and 2
    function numberNearZero(number_to_check) {
        return ((number_to_check) < 3 && (number_to_check) > -3) ? true : false;
    }

}.bind(OcRam.Local_Coop)());