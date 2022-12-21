"use strict";

const CHRHEIGHT = 34;               //キャラの高さ
const CHRWIDTH = 30;                //キャラの幅
const FONT = "48px monospace";   //使用フォント
const FONTSTYLE = "#ffffff"
const WIDTH = 1200;                   //仮想画面幅
const HEIGHT = 1280;                  //仮想画面高さ
const INTERVAL = 5;                   //フレーム呼び出し間隔
const MAP_WIDTH = 20;                //マップ幅
const MAP_HEIGHT = 17;               //マップ高さ
const SCROLL = 4;                    //スクロール速度
const START_HP = 20;                    //プレイヤーの初期HP
const START_X = 7;                    //開始位置X
const START_Y = 5;                   //開始位置Y
const SMOOTH = 0;                   //補完処理設定
const SCR_WIDTH = 10                //画面タイルサイズの半分の幅
const SCR_HEIGHT = 10               //画面タイルサイズの半分の高さ
const TILECOLMN = 20;                    //タイル列数
const TILEROW = 17;                      //タイル行数
const TILESIZE = 64;                 //タイルサイズ
const WINDSTYLE = "rgba( 0, 0, 0, 0.75 )";  //ウインドウの色

const gKey = new Uint8Array( 0x100 )

let    gAngle = 0;               //プレイヤーの向き 
let    gCursor = 0;             //カーソル位置
let    gEnemyHP;                //敵のHP
let    gEnemyType;          //敵種別
let    gEx = 0;                 //プレイヤーの経験値
let    gHP = START_HP;          //プレイヤーのHP
let    gMHP = START_HP;         //プレイヤーの最大HP
let    gLv = 1;                 //プレイヤーのレベル
let    gFrame = 0;              //内部カウンタ
let    gImgBoss;                //画像、ラスボス 
let    gImgMap;                 //画像、マップ
let    gImgPlayer;              //画像、プレイヤー
let    gItem = 0;               //所持アイテム
let    gMoveX = 0;               //移動量X
let    gMoveY = 0;               //移動量Y
let    gImgMonster;             //画像、モンスター
let gMessage1 = null;             //表示メッセージ１
let gMessage2 = null;           //表示メッセージ２
let    gOrder;                      //行動順
let    gPhase = 0;                  //戦闘フェーズ
let    gPlayerX = START_X * TILESIZE + TILESIZE / 2;            //プレイヤー座標X
let    gPlayerY = START_Y * TILESIZE + TILESIZE / 2;            //プレイヤー座標Y
let    gScreen;                 //仮想画面
let    gHeight;                 //実画面の高さ
let    gWidth;                  //実画面の幅

const gFileBoss = "https://w7.pngwing.com/pngs/392/475/png-transparent-yellow-8bit-monster-space-invaders-extreme-2-space-invaders-revolution-nintendo-ds-space-invaders-game-angle-text-thumbnail.png";
const gFileMap = "https://pipoya.net/sozai/wp-content/uploads/2021/02/image20210215-1.png";
const gFilePlayer = "G:/マイドライブ/RPG.png";
const gFileMonster = "https://cdn.imgbin.com/12/14/20/imgbin-super-mario-bros-new-super-mario-bros-super-mario-galaxy-8-bit-X5zwjydh339jjPnynhSFce3Lm.jpg";


const gEncounter = [ 0, 0, 0, 1, 0, 0, 2, 3, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,          //34
1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,          //41
1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 
1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 
1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1  ];          //敵エンカウント確率

const gMonsterName = [ "スライム", "うさぎ", "ナイト", "ドラゴン", "魔王"];         //モンスター名称

//　マップ
const gMap = 
[
0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,
20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36,37,38,39,
40,41,42,43,44,45,46,47,48,49,50,51,52,53,54,55,56,57,58,59,
60,61,62,63,64,65,66,67,68,69,70,71,72,73,74,75,76,77,78,79,
80,81,82,83,84,85,86,87,88,89,90,91,92,93,94,95,96,97,98,99,
100,101,102,103,104,105,106,107,108,109,110,111,112,113,114,115,116,117,118,119,
120,121,122,123,124,125,126,127,128,129,130,131,132,133,134,135,136,137,138,139,
140,141,142,143,144,145,146,147,148,149,150,151,152,153,154,155,156,157,158,159,
160,161,162,163,164,165,166,167,168,169,170,171,172,173,174,175,176,177,178,179,
180,181,182,183,184,185,186,187,188,189,190,191,192,193,194,195,196,197,198,199,
200,201,202,203,204,205,206,207,208,209,210,211,212,213,214,215,216,217,218,219,
220,221,222,223,224,225,226,227,228,229,230,231,232,233,234,235,236,237,238,239,
240,241,242,243,244,245,246,247,248,249,250,251,252,253,254,255,256,257,258,259,
260,261,262,263,264,265,266,267,268,269,270,271,272,273,274,275,276,277,278,279,
280,281,282,283,284,285,286,287,288,289,290,291,292,293,294,295,296,297,298,299,
300,301,302,303,304,305,306,307,308,309,310,311,312,313,314,315,316,317,318,319,
320,321,322,323,324,325,326,327,328,329,330,331,332,333,334,335,336,337,338,339,
];



//戦闘行動処理
function Action ()
{
    gPhase++;                                           //フェーズ経過

    if( ( ( gPhase + gOrder ) & 1 ) == 0 ){              //敵の行動順の場合
        const d = GetDamage( gEnemyType + 2 );
        SetMessage( gMonsterName[ gEnemyType ] + "の攻撃！", d + "のダメージ" );
        gHP -= d;                               //プレイヤーのHP減少
        if( gHP <= 0 ){                         //プレイヤーが死亡した場合
        gPhase = 7;                             //脂肪フェーズ
        };
        return;    
    };


    if( gCursor == 0 ){                                 //戦う選択時
        const d = GetDamage( gLv + 1 );                  //ダメージ計算結果取得
        SetMessage( "あなたの攻撃！", d + "のダメージ！" );
        gEnemyHP -= d;
        if( gEnemyHP <= 0 ){                    //敵を倒したとき
        gPhase = 5;
        };
        return;
    };

    if( Math.random() < 0.5 ){                      //逃げる成功時
    SetMessage( "あなたは逃げ出した", null );
    gPhase = 6;
    return;
};

    //逃げる失敗時
    SetMessage( "あなたは逃げ出した！", "しかし回り込まれてしまった！" );
};


//経験値加算
function AddExp ( val )
{
    gEx += val;                                //経験値加算
     while( gLv * ( gLv + 1 ) * 2 <= gEx ) {        //レベルアップ条件を満たしている場合
        gLv++;                                  //レベルアップ
        gMHP += 4 + Math.floor( Math.random() * 3 );        //最大HP上昇４～６
     };
};

//敵出現処理
function AppearEnemy ( t ){             
    gPhase = 1;                                     //敵出現フェーズ
    gEnemyHP = t * 3 + 5;                           //敵HP
    gEnemyType = t;
    SetMessage( "敵が現れた！", null )

};


//戦闘コマンド
function CommandFight()
{
gPhase = 2;                 //戦闘コマンド選択フェーズ
gCursor = 0;
SetMessage( " たたかう", " にげる" );
};

//戦闘画面描画処理
function DrawFight( g )
{
    g.fillStyle = "#000000";                                        //背景色
    g.fillRect( 0, 0, WIDTH, HEIGHT );                              //画面全体を矩形描画

  if( gPhase <= 5 ){             //敵が生存している場合
    if( IsBoss() ){             //ラスボスの場合
    g.drawImage( gImgBoss, WIDTH / 2 - gImgBoss.width / 2, HEIGHT / 2 - gImgBoss.height / 2 );
    }else{
    let w = gImgMonster.width / 4;
    let h = gImgMonster.height;

        g.drawImage( gImgMonster, gEnemyType * w, 0, w, h, Math.floor( WIDTH / 2 - w / 2 ), Math.floor( HEIGHT / 2 - h / 2 ), w, h );
    };     
  };
   DrawMessage( g );           //メッセージ描画
   DrawStatus( g );           //ステータス描画


   if( gPhase == 2 ){                                         //戦闘フェーズがコマンド選択中の場合
    g.fillText( "→",  200, 1000 + 50 * gCursor );                  //カーソル描画
};


    };


//フィールド描画処理
function DrawField ( g )
{
    let mx = Math.floor( gPlayerX / TILESIZE );         //プレイヤーのタイル座標X
    let my = Math.floor( gPlayerY / TILESIZE );         //プレイヤーのタイル座標Y



for( let dy= -SCR_HEIGHT; dy <= SCR_HEIGHT; dy++ ) {

    let ty = my + dy;                                   //タイル座標Y
    let py = ( ty + MAP_HEIGHT ) % MAP_HEIGHT;          //ループ後タイル座標Y

    for( let dx = -SCR_WIDTH; dx <= SCR_WIDTH; dx++) {
        let tx = mx + dx;                               //タイル座標X 
        let px = ( tx + MAP_WIDTH ) % MAP_WIDTH;        //ループ後タイル座標X
        DrawTile( g, 
            tx * TILESIZE + WIDTH / 2 - gPlayerX, 
            ty * TILESIZE + HEIGHT / 2 - gPlayerY, 
            gMap[ py * MAP_WIDTH + px ] );
    };
};


//プレイヤー
g.drawImage( gImgPlayer,
            ( gFrame >> 5 & 1 ) * CHRWIDTH, gAngle * CHRHEIGHT, CHRWIDTH, CHRHEIGHT,
              WIDTH / 2 - CHRWIDTH / 2, HEIGHT / 2 - CHRHEIGHT + TILESIZE / 2, CHRWIDTH, CHRHEIGHT );


                      //ステータスウインドウ
                      g.fillStyle = WINDSTYLE;      //ウインドウの色
                      g.fillRect( 50, 625, 200, 300 );             //矩形描画
                      
        
                DrawMessage( g );           //メッセージ描画
                DrawStatus( g );           //ステータス描画
        


            };


//描画処理
//仮想画面
function DrawMain()
{
    const g = gScreen.getContext( "2d" );                //仮想画面の2d描画コンテキストを取得

        if( gPhase <= 1 ) {
            DrawField ( g );                                      //フィールド画面描画
        }else{
            DrawFight( g );
        };

      
};        
// g.fillStyle = WINDSTYLE;      //ウインドウの色
// g.fillRect( 250, 30, 900, 150 );             //矩形描画            

//     g.font = FONT;               //文字フォントを設定
//     g.fillStyle = FONTSTYLE         //文字色
//     g.fillText( "x=" + gPlayerX + " y=" + gPlayerY + " m=" + gMap[ my * MAP_WIDTH + mx ], 300, 100 );


function DrawTile( g, x, y, idx )
{
    const   ix = (idx % TILECOLMN) * TILESIZE;
    const   iy = Math.floor (idx / TILECOLMN ) * TILESIZE;
    g.drawImage( gImgMap, ix, iy, TILESIZE, TILESIZE, x, y, TILESIZE, TILESIZE );
};


 //メッセージ描画
function DrawMessage ( g )
{
    if( !gMessage1 ) {               //メッセージ内容が存在しない場合
        return;
    }

    g.fillStyle = WINDSTYLE;      //ウインドウの色
    g.fillRect( 50, 900, 1100, 200 );             //矩形描画
    
    g.font = FONT;               //文字フォントを設定
    g.fillStyle = FONTSTYLE         //文字色

    

    g.fillText( gMessage1, 250, 1000 );         //メッセージ１行目描画
    if( gMessage2 ){
    g.fillText( gMessage2, 250, 1050 );         //メッセージ２行目描画
    };

  

};


//ステータス描画
function DrawStatus( g )
{
    g.font = FONT;               //文字フォントを設定
    g.fillStyle = FONTSTYLE         //文字色
    g.fillText( "Lv", 100, 700 ); DrawTextR( g, gLv, 150, 700 );      //Lv
    g.fillText( "HP", 100, 800 ); DrawTextR( g, gHP, 150, 800 );      //HP
    g.fillText( "Ex", 100, 900 ); DrawTextR( g, gEx, 150, 900 );      //Ex
};

function DrawTextR ( g, str, x, y )
{
    g.textAlign = " right ";
    g.fillText( str, x, y );
    g.textAlign = " left ";
};

//ダメージ量算出
function GetDamage( a )
{
    return( Math.floor( a * ( 1 + Math.random() ) ) );       //攻撃力１～２倍
};

function IsBoss()
{
    return( gEnemyType == gMonsterName.length - 1 );
};

function LoadImage()
{
    gImgBoss = new Image(); gImgBoss.scr = gFileBoss;   //ラスボス画像読み込み
    gImgMap = new Image(); gImgMap.src = gFileMap; //マップ画像読み込み
    gImgPlayer = new Image(); gImgPlayer.src = gFilePlayer;   //キャラクター画像読み込み
    gImgMonster = new Image(); gImgMonster.scr = gFileMonster;     //モンスター画像読み込み

};


// function SetMessage( v1, v2 = null ) //IE対応
function SetMessage( v1, v2 )
{
    gMessage1 = v1;
    gMessage2 = v2;
};


//IE対応
function Sign( val )
{
    if( val == 0 ){
        return( 0 )
    };
    if( val < 0 ){
        return( -1 )
    };
    return( 1 );
};

//フィールド進行処理
function TickField()
{
    if( gPhase != 0 ){
        return;
    };
    if( gMoveX != 0 || gMoveY != 0 || gMessage1 ){}          //移動中またはメッセージ表示中の場合
    else    if( gKey[ 37 ] ){ gAngle = 0;   gMoveX = -TILESIZE; }    //左
    else    if( gKey[ 38 ] ){ gAngle = 3;   gMoveY = -TILESIZE; }   //上
    else    if( gKey[ 39 ] ){ gAngle = 1;   gMoveX = TILESIZE; }    //右
    else    if( gKey[ 40 ] ){ gAngle = 2;   gMoveY = TILESIZE; }    //下

   //移動後のタイル座標判定
   let mx = Math.floor( ( gPlayerX + gMoveX ) / TILESIZE ); //タイル座標X
   let my = Math.floor( ( gPlayerY + gMoveY ) / TILESIZE ); //タイル座標Y
   mx += MAP_WIDTH;         //マップループ処理X
   mx %= MAP_WIDTH;        //マップループ処理X
   mx += MAP_HEIGHT;        //マップループ処理Y
   mx %= MAP_HEIGHT;        //マップループ処理Y
   let m = gMap[ my * MAP_WIDTH + mx ];        //タイル番号
   if( m < 10 ){                //侵入不可地形の場合
       gMoveX = 0;             //移動禁止X
       gMoveY = 0;             //移動禁止Y
   };

   if( Math.abs( gMoveX ) + Math.abs( gMoveY ) == SCROLL ){             //升目移動終わる直前



    if( m == 86 ){                              //主人公宅
        gHP = gMHP;                             //HP全回復
        SetMessage( "魔王を倒して！", null );
    };

    if( m == 261 ){                             //雑貨屋
        gHP = gMHP;                             //HP全回復
        SetMessage( "魔王は武器屋に", "いたなあ" );
    };

    if( m == 88){                               //鍵のありか
        gItem = 1;                              //鍵入手
        SetMessage( "鍵を見つけた！", null );
    };

    if( m == 320 ){
        SetMessage( "紙切れが落ちていた", "「鍵は家の横に」" );
    };


    if( m == 255 ){                                 //武器屋
        if( gItem == 0 ){                           //鍵を保持していない場合
        gPlayerY += TILESIZE;                       //1マス上へ移動
        SetMessage( "鍵が必要です", null );
        }
        else{                            
            AppearEnemy( gMonsterName.length - 1 );
            SetMessage( "フハハハハハハハ", "私が魔王だが何の用..." );
        }
    };

    if( Math.random() * 10 < gEncounter [ m ] ){        //ランダムエンカウント
       let  t = Math.abs( gPlayerX / TILESIZE - START_X ) +
                Math.abs( gPlayerY / TILESIZE - START_Y );
        if( m == 6 ){                   //マップタイプによる敵の設定。今回は未対応
            t += 8;                                 //敵レベルを0.5上昇
        };
        if( m == 7 ){                               //敵レベルを１上昇
            t += 16
        };
        t += Math.random() * 8;                     //敵レベルを0~0.5上昇
                t = Math.floor( t / 8 );
                t = Math.min( t, gMonsterName.length - 2 );         //上限処理
        AppearEnemy( 0 );
       };
};


        gPlayerX += Sign( gMoveX ) * SCROLL;        //プレイヤー座標移動X
        gPlayerY += Sign( gMoveY ) * SCROLL;        //プレイヤー座標移動Y
        gMoveX -= Sign( gMoveX ) * SCROLL;          //移動量消費X
        gMoveY -= Sign( gMoveY ) * SCROLL;          //移動量消費Y

     
        //マップループ処理
        gPlayerX += ( MAP_WIDTH * TILESIZE );
        gPlayerX %= ( MAP_WIDTH * TILESIZE );
        gPlayerY += ( MAP_HEIGHT * TILESIZE );
        gPlayerY %= ( MAP_HEIGHT * TILESIZE );
    
};


//実画面
function WmPaint()
{
    DrawMain();
    const ca = document.getElementById( "main" );   //mainキャンパスの要素を取得
    const g = ca.getContext( "2d" );                //2d描画コンテキストを取得
    g.drawImage( gScreen, 0, 0, gScreen.width, gScreen.height, 0, 0, gWidth, gHeight ); //仮想画面のイメージを実画面に転送

};

//画面サイズ
function WmSize()
{
    const ca = document.getElementById( "main" );   //mainキャンパスの要素を取得
    ca.width= window. innerWidth;               //キャンパスの幅をブラウザの幅へ変更
    ca.height = window. innerHeight;            //キャンパスの高さをブラウザの高さへ変更

    const g = ca.getContext( "2d" );                //2d描画コンテキストを取得
    g.imageSmoothingEnabled = g.msImageSmoothingEnabled = SMOOTH;    //補完処理

    //実画面サイズを計測。ドットのアスペクト比を維持したままでの最大サイズを計測する。
        gWidth = ca.height;
        gHeight = ca.width;
        if( gWidth / WIDTH < gHeight / HEIGHT )
        {
            gHeight = gWidth * HEIGHT / WIDTH;
        }else{
            gWidth = gHeight * WIDTH / HEIGHT;
        };
};

// タイマーイベント発生時の処理
function WmTimer()
{
    if( !gMessage1 ){
    gFrame++;                   //内部カウンタを加算
    TickField();            //フィールド進行処理
};
    WmPaint();

};


//キー入力（DOWN）イベント
window.onkeydown = function( ev )
{
    let c = ev.keyCode;     //キーコード取得

    if( gKey[ c ] != 0 ){               //既に押下中の場合（キーリピート）
        return;
    };
    gKey[ c ] = 1;

    if( gPhase == 1 ){              //敵が現れた場合
     CommandFight();                         //戦闘コマンド
        return;
    };
  
    if ( gPhase == 2 ){                 //戦闘コマンド選択中の場合
       if( c == 13 || c == 90 ){     //Enterキー、またはZキーの場合
        Action();                           //戦闘行動処理
       gOrder = Math.floor( Math.random() * 2 );           //戦闘行動順       
    }else{
        gCursor = 1 - gCursor;  //カーソル移動
    };   
    return;
    };

    if( gPhase == 3 ){
        Action();                   //戦闘行動処理
        return;
    };
    
    if( gPhase == 4 ){
        CommandFight();             //戦闘コマンド
        
        return;
    };

    if( gPhase == 5 ){
        gPhase = 6;
        SetMessage( "敵を倒した！", null );
        AddExp( gEnemyType + 1 );     //経験値加算
        return;
    };

        if( gPhase == 6 ){
            if( IsBoss() && gCursor == 0 ){         //敵がラスボスかつ戦う選択時
                SetMessage( "魔王を倒し、世界に平和が訪れた", null );
                return;
            };
        gPhase = 0;                 //マップ移動フェーズ    
            
    };

    if( gPhase == 7 ){
        gPhase = 8;
        SetMessage( "あなたは死亡した", null );
        return;
    };

    if( gPhase == 8 ){
        SetMessage( "GAME OVER", null );
        return;
    };
    

    gMessage1 = null;
    gMessage2 = null;


};
    

//キー入力（UP）イベント
window.onkeyup = function( ev )
{
    gKey[ ev.keyCode ] = 0
};


// ブラウザ起動イベント
window.onload = function()
{
    LoadImage();

    gScreen = document.createElement( "canvas" );   //仮想画面を作成
    gScreen.width = WIDTH;                          //仮想画面幅を設定
    gScreen.height = HEIGHT;                       //仮想画面高さを設定
    
    WmSize();                                               //画面サイズ初期化
    window.addEventListener( "resize", function() { WmSize() })     //ページサイズ変更に対応
    setInterval(function(){ WmTimer() }, INTERVAL);
};










