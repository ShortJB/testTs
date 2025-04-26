using UnityEngine;
using System.Collections;

[System.Serializable]
public partial class Player : MonoBehaviour
{
    private RaycastHit hit;
    public Transform myTransform;
    private GameObject myGO;
    public GameObject myAnimation;
    public Rigidbody myRigidbody;
    public Rigidbody thisRigidbody;
    public bool shootHoops;
    public int startWithPower;
    public float offAir;
    public static bool isplayer1;
    public bool godMode;
    public bool superGodMode;
    public bool inStore;
    public GravityField[] myPlanetoids;
    public float[] myXs;
    private int planetCounter;
    private Vector3 thisVector;
    private Vector3 thisForce;
    private float thisMag;
    private Vector3 whereTo;
    private bool xBigger;
    private float nearestPick;
    private Transform planetPicked;
    private Vector3 planetPicker;
    private float planetPickMin;
    private Transform planetCandidate;
    public Vector3 deathPos;
    public Vector3 deathVel;
    private float coinsFloat;
    public float leftMost;
    public float rightMost;
    private bool airJump;
    public Mine[] mines;
    private int mineCounter;
    public GameObject blade;
    public Blade bladeScript;
    public GameObject fakeHammer;
    public GameObject fakeMagnet;
    public GameObject fakeBoomJetpack;
    public bool tutorialPhysics;
    private Color trailAddColor;
    private bool lowFuel;
    private Transform thisTransform;
    public ParticleSystem myShineParticles;
    private Transform myShineParticlesTransform;
    public ParticleSystem myShineLoveParticles;
    private Transform myShineLoveParticlesTransform;
    private SpaceShip thisSpaceship;
    private SpaceChick thisSpaceChick;
    private SpaceChick otherSpaceChick;
    private SpaceChick extraSpaceChick;
    private GravityField thisPlanetoid;
    private string thisString;
    public bool hasChosenPlanet;
    private Transform chosenPlanet;
    private Touch touch1;
    private int touchCounter;
    private AnimationState animState;
    private Vector3 planetNormal;
    public Transform mySmoke;
    public ParticleSystem mySmokeP;
    private float smokePcounter;
    private bool asteroid;
    private bool physicsObject;
    public GameObject tapheremenu1;
    public GameObject tapheremenu2;
    public GameObject tapheremenu3;
    private bool didTap;
    public bool dead;
    private bool car;
    public bool lookForControls;
    private GameObject thisGO;
    private Rigidbody currentPlanet;
    public int jumpButton;
    private int none;
    private int stay;
    private int start;
    private int end;
    private float shipHandling;
    private bool shipDoesntShake;
    private bool jetpackOn;
    public bool secChance;
    public bool touchingPlanet;
    private bool carryingChick;
    public Collider myCollider;
    private float velocityLimit;
    private Vector3 runDirection;
    private float jumpCounter;
    private float jumpTime;
    private float lastVelocityX;
    private Transform myPlanet;
    public ParticleSystem myJetPackFire;
    private Transform myJetPack;
    private bool shipHit;
    public Transform head;
    public MeshRenderer head1;
    public MeshRenderer head2;
    public Transform torso;
    private bool runningOnIphone;
    private bool continueRunning;
    public bool player2;
    public Transform player1;
    public float planetGravity;
    private float halfScreen;
    private Vector3 currentForce;
    public bool multiplayer;
    private int physicsFrame;
    private int evaluateFrame;
    public GameGod gamegod;
    private EventsManager flurry;
    private Quaternion initialRot;
    private float myZ;
    private Transform lastPlanet;
    public ParticleSystem fireSmoke;
    public ParticleSystem fire1;
    public ParticleSystem fire2;
    public Transform fire;
    public Rigidbody[] gibs;
    public GameObject explosion;
    public Transform explosionT;
    private Transform myTrail;
    public TrailRenderer trailRenderer;
    private float trailWidth;
    private Vector3 lastNormal;
    public TextMesh hearts;
    public TextMesh chicks;
    public TextMesh coins;
    public int heartsN;
    public int chicksN;
    public int coinsN;
    public int coinsNfake;
    private bool canDrive;
    public bool spaceshipMode;
    private Vector3 spaceshipGo;
    private bool spaceshipFlip;
    private bool spaceshipCanFly;
    private Transform spaceship;
    private bool jumped;
    private bool stillNeedsTime;
    private bool demoEnd;
    public ParticleSystem runParticles;
    private bool runParticlesBool;
    public LayerMask planetMask;
    private float myHeight;
    public Transform myArt;
    private Vector3 localArtPosition;
    public Transform myShadow;
    private Vector3 localShadowPosition;
    private float blinkTimer;
    private float blinkCounter;
    private float coinCounter;
    private bool blinking;
    private bool spriteOn;
    private int coinSoundCurrent;
    public Coin[] lostCoins;
    private float coinCounterish;
    private float hitDistance;
    public AudioClip myRunningSound;
    public AudioClip myFlyingSound;
    public AudioClip coinSound;
    public AudioClip heartSound;
    public AudioClip myJumpSound;
    public AudioClip hurt;
    public AudioClip chickLove;
    public AudioClip carLoop;
    public AudioClip carSound;
    public AudioClip metalCrash;
    private int coinInt;
    private float myRunningTime;
    private AudioSource myAudioSource;
    private AudioSource coinSource;
    private AudioSource coinSource2;
    private AudioSource coinSource3;
    private AudioSource coinSource4;
    private AudioSource misc;
    private Material myMaterial;
    private Material trailMaterial;
    private Vector3 myLastVelocity;
    private bool running;
    //Airdrops
    public GameObject myPower;
    private GameObject hammerPower;
    private GameObject magnetPower;
    private GameObject carPower;
    private GameObject colognePower;
    private Transform powerT;
    public int currentPower;
    private int nopower = 0;
    private int magnet = 1; //磁铁
    private int boomJetpack = 2; //落雷
    private int chickHammer = 3; //锤子
    private int ferrari = 4; //汽车
    private int pullNslice = 5; //血滴子
    private int cologne = 6; //香水
    private int hook = 7;
    private int stealth = 22;
    //Upgrades
    public bool doubleJump;
    public bool doubleChick;
    private int doubleChickN;
    public bool chicks4life;
    //Coin Doublers
    public bool goldDigger;
    public bool coinDoubler;
    private Vector3 myInitialScale;
    private float artSize;
    public Collider[] thisColliders;
    public Texture2D defaultSuit;
    public Texture2D stealthSuit;
    public Collider idCollider;
    private bool inverted;
    private bool superGravity;
    public bool menuVersion;
    public Vector3 pausePos;
    public Material singlePlayerTrail;
    private float jumpLine;
    private bool backwards;
    public GameObject tutArrow;
    public MeshRenderer tutArrowR;
    public bool shouldArrow;
    public bool isHome;
    public bool isPause;
    public Hook hookGO;
    private float timer;
    private bool beCtrl;
    // 购买祖车按钮
    public Vector2 ltPos;
    public Vector2 rbPos;
    //tips 击中
    public Vector2[] tipHitLs;
    public Vector2[] tipHitRs;
    //是否只能点中购买框。
    public bool forceGuide;

    private string myCurrentAnimation;

    // private ParticleSystem myJetPackFireInstance;

    public virtual void Awake()//if(shootHoops){ inverted=true; myArt.localScale.x=-artSize; }
    {
        //Upgrades and Others
        //EncryptedPlayerPrefs.SetInt("2chance",1);
        this.flurry = EventsManager.GetInstance();
        this.SetPurchases();
        if ((this.player2 && (EncryptedPlayerPrefs.GetInt("multiplayer") != 1)) && !this.shootHoops)
        {
            return;
        }
        this.lookForControls = true;
        this.coinInt = 1;
        this.halfScreen = Screen.width / 2;
        this.myAudioSource = (AudioSource) this.gameObject.AddComponent(typeof(AudioSource));
        this.coinSource = (AudioSource) this.gameObject.AddComponent(typeof(AudioSource));
        this.coinSource2 = (AudioSource) this.gameObject.AddComponent(typeof(AudioSource));
        this.coinSource3 = (AudioSource) this.gameObject.AddComponent(typeof(AudioSource));
        this.coinSource4 = (AudioSource) this.gameObject.AddComponent(typeof(AudioSource));
        this.misc = (AudioSource) this.gameObject.AddComponent(typeof(AudioSource));
        this.coinSource.clip = this.coinSound;
        this.coinSource2.clip = this.coinSound;
        this.coinSource3.clip = this.coinSound;
        this.coinSource4.clip = this.coinSound;
        this.myHeight = this.myTransform.lossyScale.y;
        if ((Application.platform == RuntimePlatform.IPhonePlayer) || (Application.platform == RuntimePlatform.Android))
        {
            this.runningOnIphone = true;
        }
        this.myShineParticlesTransform = this.myShineParticles.transform;
        this.myShineLoveParticlesTransform = this.myShineLoveParticles.transform;
        // this.myJetPack = this.myJetPackFire.transform;
        this.myTransform = this.transform;
        // myGameObject = this.gameObject;
        this.myRigidbody = this.GetComponent<Rigidbody>();
        this.myCollider = this.myRigidbody.GetComponent<Collider>();
        // myFeet = this.myTransform.TransformDirection(Vector3.down);
        this.myAnimation.GetComponent<Animation>()["run"].speed = 1.4f;
        this.myAnimation.GetComponent<Animation>()["Jump"].speed = 2;
        this.myAnimation.GetComponent<Animation>()["Jump2"].speed = 1.5f;
        this.myAnimation.GetComponent<Animation>()["Hurt"].speed = 0.5f;
        this.myRigidbody.AddForce(Vector3.down, (ForceMode) 5);
        this.myGO = this.gameObject;
        //mySmokeP.playbackSpeed=2;
        //fireSmoke.playbackSpeed=0.5;
        this.myZ = this.myTransform.position.z;
        this.myTrail = this.trailRenderer.transform;
        // lastArtPos = this.myTransform.position;
        this.myHeight = this.myTransform.lossyScale.y;
        this.myShineParticlesTransform.parent = null;
        this.myShineLoveParticlesTransform.parent = null;
        this.localArtPosition = this.myArt.localPosition;
        this.initialRot = this.myTransform.rotation;
        this.myArt.parent = null;
        this.fire.parent = null;
        this.explosionT.parent = null;
        this.mySmoke.parent = null;
        if (!this.menuVersion)
        {
            this.UpdateHeartsGUI();
            this.fakeHammer.gameObject.SetActive(false);
            this.fakeMagnet.gameObject.SetActive(false);
            this.fakeBoomJetpack.gameObject.SetActive(false);
        }
        if (this.player2)
        {
            this.myMaterial = this.torso.gameObject.GetComponent<Renderer>().sharedMaterial;
        }
        else
        {
            this.myMaterial = this.head.gameObject.GetComponent<Renderer>().sharedMaterial;
        }
        this.trailMaterial = this.trailRenderer.sharedMaterial;
        this.myMaterial.color = Color.white;
        this.artSize = this.myArt.localScale.x;
        if (this.player2)
        {
            this.myMaterial.mainTexture = this.defaultSuit;
        }
        this.myInitialScale = this.head.localScale;
        this.beCtrl = true;
    }

    //登记是否具有商品能力
    public virtual void SetPurchases()
    {
        bool hadMenage = false;
        if (this.menuVersion || this.player2)
        {
            return;
        }
        if (EncryptedPlayerPrefs.GetInt("bigHead") == 1)
        {
            this.head1.enabled = false;
            this.head2.enabled = true;
        }
        else
        {
            this.head2.enabled = false;
            this.head1.enabled = true;
        }
        hadMenage = this.doubleChick;
        this.doubleJump = false;
        this.secChance = false;
        this.chicks4life = false;
        this.doubleChick = false;
        this.coinDoubler = false;
        this.goldDigger = false;
        if (EncryptedPlayerPrefs.GetInt("doubleJump_Flag") == 1)
        {
            this.doubleJump = true;
        }
        if (EncryptedPlayerPrefs.GetInt("chicks4life_Flag") == 1)
        {
            this.chicks4life = true;
        }
        if (EncryptedPlayerPrefs.GetInt("menage_Flag") == 1)
        {
            this.doubleChick = true;
        }
        if (EncryptedPlayerPrefs.GetInt("coinDoubler") == 1)
        {
            this.coinDoubler = true;
        }
        if (EncryptedPlayerPrefs.GetInt("goldDigger") == 1)
        {
            this.goldDigger = true;
        }
        if (EncryptedPlayerPrefs.GetInt("2chance") == 1)
        {
            this.secChance = true;
        }
        PayAndroid.isDoubleJump = this.doubleJump;
        if (hadMenage && !this.doubleChick)
        {
            if (this.carryingChick)
            {
                this.thisSpaceChick.Hurt(this.myTransform.TransformDirection(new Vector3(-0.5f, 0.5f, 0)));
                this.extraSpaceChick.Hurt(this.myTransform.TransformDirection(new Vector3(-0.5f, 0.5f, 0)));
                this.doubleChickN = 0;
                this.carryingChick = false;
                this.StartCoroutine(this.WeNeedTime());
            }
        }
    }

    public virtual void Start()
    {
        // this.myJetPackFireInstance = Instantiate(myJetPackFire, transform);
        this.gamegod = GameGod.instance;
        if (this.player2)
        {
            this.player1 = this.gamegod.Player1Transform();
        }
        this.localShadowPosition = this.myShadow.localPosition;
        this.myShadow.parent = null;
        this.spriteOn = true;
        this.coinCounter = 0;
        while (this.coinCounter < this.lostCoins.Length)
        {
            this.lostCoins[(int)this.coinCounter].StartLostCoin();
            this.coinCounter++;
        }
        if (this.startWithPower != 0)
        {
            this.StartCoroutine(this.ActivatePower(this.startWithPower));
        }
        if (!this.gamegod.multiplayer && !this.player2)
        {
            this.trailRenderer.material = this.singlePlayerTrail;
        }
        this.multiplayer = this.gamegod.multiplayer;
        if (this.multiplayer)
        {
            if (!this.didTap)
            {
                this.tapheremenu1.gameObject.SetActive(false);
                this.tapheremenu2.gameObject.SetActive(false);
                this.tapheremenu3.gameObject.SetActive(false);
                this.didTap = true;
            }
        }
        else
        {
            this.didTap = true;
        }
        //如果是Michael就倒着走
        if (EncryptedPlayerPrefs.GetString("costume") == "Michael")
        {
            this.backwards = true;

            {
                float _307 = this.myArt.localScale.x * -1;
                Vector3 _308 = this.myArt.localScale;
                _308.x = _307;
                this.myArt.localScale = _308;
            }
        }
        if (this.gamegod.numberOfSections == 0)
        {
            this.isHome = true;
        }
        this.gamegod.resetSavedChicks();
        // needTutorialSkill = 0;
        // tutorialBloodMoney = false;
        this.gamegod.ShowRentCarBtn();
    }

    public virtual void TutArrow()
    {
        this.tutArrowR.enabled = true;
        this.shouldArrow = true;
    }

    public virtual void NoTutArrow()
    {
        UnityEngine.Object.Destroy(this.tutArrow);
        this.shouldArrow = false;
    }

    public virtual void DeactivatePower(int i)
    {
        this.currentPower = 0;
        switch (i)
        {
            case 3:
                if (this.backwards)
                {

                    {
                        float _309 = Mathf.Abs(this.myArt.localScale.x) * -1;
                        Vector3 _310 = this.myArt.localScale;
                        _310.x = _309;
                        this.myArt.localScale = _310;
                    }
                }
                UnityEngine.Object.Destroy(this.myPower);
                this.godMode = false;
                this.fakeHammer.gameObject.SetActive(false);
            break;
            case 1:
                UnityEngine.Object.Destroy(this.myPower);
                this.fakeMagnet.gameObject.SetActive(false);
            break;
            case 7:
                this.hookGO.myGO.SetActiveRecursively(false);
            break;
            case 2:
                this.fakeBoomJetpack.gameObject.SetActive(false);
                this.StartCoroutine(this.mines[0].UnplaceFinal());
                this.StartCoroutine(this.mines[1].UnplaceFinal());
                this.StartCoroutine(this.mines[2].UnplaceFinal());
                this.StartCoroutine(this.mines[3].UnplaceFinal());
                this.StartCoroutine(this.mines[4].UnplaceFinal());
            break;
            case 5:
                this.blade.SetActiveRecursively(false);
            break;
            case 6:
                this.gamegod.ChickOffDehodorant();
                this.trailRenderer.gameObject.gameObject.SetActive(true);
                UnityEngine.Object.Destroy(this.myPower);
            break;
            case 4:
                UnityEngine.Object.Destroy(this.myPower);
                this.car = false;
                this.godMode = false;
            break;
        }
    }

    //取消所有空降宝箱的能力
    public virtual void DeactivateAllBoxPower()
    {
        //取消锤子
        if (!(this.chickHammer == null))
        {
            if (this.backwards)
            {

                {
                    float _311 = Mathf.Abs(this.myArt.localScale.x) * -1;
                    Vector3 _312 = this.myArt.localScale;
                    _312.x = _311;
                    this.myArt.localScale = _312;
                }
            }
            if (this.hammerPower != null)
            {
                UnityEngine.Object.Destroy(this.hammerPower);
            }
            this.godMode = false;
            this.fakeHammer.gameObject.SetActive(false);
        }
        //取消磁铁
        if (this.magnetPower != null)
        {
            UnityEngine.Object.Destroy(this.magnetPower);
            this.fakeMagnet.gameObject.SetActive(false);
        }
        //落雷
        if (this.fakeBoomJetpack != null)
        {
            this.fakeBoomJetpack.gameObject.SetActive(false);
        }
        if ((this.mines[0] != null) && this.mines[0].gameObject.active)
        {
            this.StartCoroutine(this.mines[0].UnplaceFinal());
        }
        if ((this.mines[1] != null) && this.mines[1].gameObject.active)
        {
            this.StartCoroutine(this.mines[1].UnplaceFinal());
        }
        if ((this.mines[2] != null) && this.mines[2].gameObject.active)
        {
            this.StartCoroutine(this.mines[2].UnplaceFinal());
        }
        if ((this.mines[3] != null) && this.mines[3].gameObject.active)
        {
            this.StartCoroutine(this.mines[3].UnplaceFinal());
        }
        if ((this.mines[4] != null) && this.mines[4].gameObject.active)
        {
            this.StartCoroutine(this.mines[4].UnplaceFinal());
        }
        //血滴子
        if (this.blade != null)
        {
            this.blade.SetActiveRecursively(false);
        }
        //汽车
        if (this.carPower != null)
        {
            UnityEngine.Object.Destroy(this.carPower);
            this.car = false;
            this.godMode = false;
        }
        //香水
        if (this.colognePower != null)
        {
            this.gamegod.ChickOffDehodorant();
            this.trailRenderer.gameObject.gameObject.SetActive(true);
            UnityEngine.Object.Destroy(this.colognePower);
        }
    }

    public virtual void PauseMe(bool b)
    {
        if (b)
        {
            this.lookForControls = false;
            if (this.myAudioSource != null)
            {
                this.myAudioSource.Stop();
            }
        }
        else
        {
            this.lookForControls = true;
            this.offAir = Time.realtimeSinceStartup;
        }
    }

    public virtual string GetPowerNameFromIndex(int i)
    {
        if (i == 1)
        {
            return "吸金磁铁";
        }
        else
        {
            if (i == 2)
            {
                return "落雷";
            }
            else
            {
                if (i == 3)
                {
                    return "霸王锤";
                }
                else
                {
                    if (i == 4)
                    {
                        return "太空超酷跑车";
                    }
                    else
                    {
                        if (i == 5)
                        {
                            return "血滴子";
                        }
                        else
                        {
                            if (i == 6)
                            {
                                return "性感香水";
                            }
                            else
                            {
                                return "Null";
                            }
                        }
                    }
                }
            }
        }
    }

    public virtual IEnumerator ActivatePower(int i)
    {
        int ui = 0;
        //先把先前的道具去除。
        this.DeactivatePower(this.currentPower);
        this.currentPower = i;
        this.myCurrentAnimation = this.myAnimation.GetComponent<Animation>().clip.name;
        this.myAnimation.GetComponent<Animation>().Stop();
        this.myAnimation.GetComponent<Animation>()["run"].time = 0.1f;
        this.head.localScale = this.myInitialScale;
        yield return null;
        switch (i)
        {
           case 3:
                if (this.backwards)
                {

                    {
                        float _313 = Mathf.Abs(this.myArt.localScale.x);
                        Vector3 _314 = this.myArt.localScale;
                        _314.x = _313;
                        this.myArt.localScale = _314;
                    }
                }
                this.hammerPower = UnityEngine.Object.Instantiate((GameObject) Resources.Load("ChickHammer", typeof(GameObject)));
                this.myPower = this.hammerPower;
                this.powerT = this.myPower.transform;
                //powerT.rotation=myTransform.rotation;
                this.powerT.parent = this.head;
                this.powerT.localPosition = new Vector3(0.4672667f, -7.834409f, -0.4806813f);
                this.powerT.localEulerAngles = new Vector3(270, 292, 0);
                this.powerT.GetComponent<Animation>().Play();
                this.powerT.GetComponent<Animation>()[this.powerT.GetComponent<Animation>().clip.name].time = this.powerT.GetComponent<Animation>()[this.powerT.GetComponent<Animation>().clip.name].length;
                //powerT.rotation.z=-180;
                if (!this.carryingChick)
                {
                    this.fakeHammer.gameObject.SetActive(true);
                    yield return null;
                    this.myPower.gameObject.SetActive(false);
                }
                else
                {
                    this.godMode = true;
                }
                break;
            case 1:
                this.fakeMagnet.gameObject.SetActive(true);
                this.magnetPower = UnityEngine.Object.Instantiate((GameObject) Resources.Load("Magnet", typeof(GameObject)));
                this.myPower = this.magnetPower;
                this.powerT = this.myPower.transform;
                this.powerT.parent = this.myTransform;
                this.powerT.localPosition = new Vector3(1.095759f, 0.4043286f, 0);
                break;
            case 7:
                this.hookGO.myGO.SetActiveRecursively(true);
                break;
            case 2:
                this.fakeBoomJetpack.gameObject.SetActive(true);
                while (ui < this.mines.Length)
                {
                    this.mines[ui].gameObject.gameObject.SetActive(true);
                    ui++;
                }
                break;
            case 5:
                this.blade.transform.position = this.myTransform.position;
                this.blade.SetActiveRecursively(true);
                this.bladeScript.BladeStart(this.myTransform);
                break;
            case 22:
                if (this.player2)
                {
                    this.gamegod.Stealthp2(true);
                }
                else
                {
                    this.gamegod.Stealthp1(true);
                }
                //SetArtSize(1.15);
                this.godMode = true;
                this.myMaterial.mainTexture = this.stealthSuit;
                break;
            case 4:
                this.carPower = UnityEngine.Object.Instantiate((GameObject) Resources.Load("Ferrari", typeof(GameObject)));
                this.myPower = this.carPower;
                this.powerT = this.myPower.transform;
                this.PlaySound(this.carSound, 0.7f);
                this.car = true;
                this.godMode = true;
                this.powerT.rotation = this.myTransform.rotation;
                this.powerT.parent = this.head.parent;
                this.powerT.localPosition = new Vector3(0.08630212f, 273.011f, 0.2846243f);
                break;
            case 6:
                this.gamegod.ChickDehodorant(this.myTransform);
                this.colognePower = UnityEngine.Object.Instantiate((GameObject) Resources.Load("Dehodorant", typeof(GameObject)));
                this.myPower = this.colognePower;
                this.powerT = this.myPower.transform;
                this.powerT.parent = this.myTransform;
                this.trailRenderer.gameObject.gameObject.SetActive(false);
                this.powerT.localPosition = new Vector3(0.002383316f, -0.02326852f, 4.831397f);
                break;
        }
        this.myAnimation.GetComponent<Animation>().Play(this.myCurrentAnimation);
    }

    public virtual void PlayRunningSound()// myAudioSource.Play();
    {
    }

    public virtual void PlaySound(AudioClip thisClip)
    {
        this.misc.loop = false;
        this.misc.time = 0;
        this.misc.pitch = 1;
        this.misc.volume = 1;
        this.misc.clip = thisClip;
        this.misc.Play();
    }

    public virtual void PlaySound(AudioClip thisClip, float f)
    {
        this.misc.loop = false;
        this.misc.time = 0;
        this.misc.pitch = f;
        this.misc.volume = 1;
        this.misc.clip = thisClip;
        this.misc.Play();
    }

    public virtual void PlaySound(AudioClip thisClip, float f, float v)
    {
        this.misc.loop = false;
        this.misc.time = 0;
        this.misc.pitch = f;
        this.misc.volume = v;
        this.misc.clip = thisClip;
        this.misc.Play();
    }

    public virtual IEnumerator PlaySpaceShipSound()
    {
        float soundFloat = 0.0f;
        this.myAudioSource.loop = true;
        this.myAudioSource.time = 0;
        this.myAudioSource.pitch = 2;
        this.myAudioSource.volume = 0.4f;
        this.myAudioSource.clip = this.myFlyingSound;
        this.myAudioSource.Play();
        while (soundFloat < 2)
        {
            soundFloat = soundFloat + (Time.deltaTime * 1.2f);
            //myAudioSource.volume=soundFloat*0.35;
            this.myAudioSource.pitch = -soundFloat;
            yield return null;
        }
    }

    public virtual IEnumerator DemoEnd()
    {
        float soundFloat = 0.0f;
        this.demoEnd = true;
        soundFloat = 2;
        while (soundFloat < 3)
        {
            soundFloat = soundFloat + Time.deltaTime;
            this.myAudioSource.volume = soundFloat;
            this.myAudioSource.pitch = soundFloat;
            yield return null;
        }
    }

    public virtual void PlayCoinSound()
    {
        if (this.coinSoundCurrent != 1)
        {
            this.coinSource2.pitch = 1;
            this.coinSource2.volume = 0.4f;
            this.coinSource.volume = 0.4f;
            this.coinSource.clip = this.coinSound;
            this.coinSource2.clip = this.coinSound;
            this.coinSoundCurrent = 1;
        }
        if (this.coinInt == 1)
        {
            this.coinSource.Play();
            this.coinInt = 2;
        }
        else
        {
            this.coinSource2.Play();
            this.coinInt = 1;
        }
    }

    public virtual void PlayCoinSound2()
    {
        this.coinSoundCurrent = 2;
        if (this.coinInt == 1)
        {
            this.coinSource.clip = this.coinSound;
            this.coinSource.Play();
            this.coinInt = 2;
        }
        else
        {
            if (this.coinInt == 2)
            {
                this.coinSource2.clip = this.coinSound;
                this.coinSource2.Play();
                this.coinInt = 3;
            }
            else
            {
                if (this.coinInt == 3)
                {
                    this.coinSource3.clip = this.coinSound;
                    this.coinSource3.Play();
                    this.coinInt = 4;
                }
                else
                {
                    this.coinSource4.clip = this.coinSound;
                    this.coinSource4.Play();
                    this.coinInt = 1;
                }
            }
        }
    }

    public virtual void PlayHeartSound()
    {
        this.coinSoundCurrent = 0;
        if (this.coinInt == 1)
        {
            this.coinSource.clip = this.heartSound;
            this.coinSource.Play();
            this.coinInt = 2;
        }
        else
        {
            if (this.coinInt == 2)
            {
                this.coinSource2.clip = this.heartSound;
                this.coinSource2.Play();
                this.coinInt = 3;
            }
            else
            {
                if (this.coinInt == 3)
                {
                    this.coinSource3.clip = this.heartSound;
                    this.coinSource3.Play();
                    this.coinInt = 4;
                }
                else
                {
                    this.coinSource4.clip = this.heartSound;
                    this.coinSource4.Play();
                    this.coinInt = 1;
                }
            }
        }
    }

    public virtual void PlayHeartSound2()
    {
        this.coinSource.volume = 0.7f;
        this.coinSource.pitch = Random.Range(1.3f, 1.7f);
        this.coinSource.clip = this.heartSound;
        this.coinSource.Play();
    }

    public virtual void StopRunningSound()
    {
        if (this.car)
        {
            return;
        }
        this.myRunningTime = this.myAudioSource.time;
        this.myAudioSource.Stop();
    }

    public virtual void PlayChickSound()
    {
        //myRunningTime=myAudioSource.time;
        //myAudioSource.Stop();
        //running=false;
        //myAudioSource.volume=1.5;
        this.coinSource3.loop = false;
        this.coinSource3.volume = 2;
        this.coinSource3.pitch = 1;
        this.coinSource3.clip = this.chickLove;
        this.coinSource3.time = 0;
        this.coinSource3.Play();
    }

    public virtual void PlayHurtSound()
    {
        //myRunningTime=myAudioSource.time;
        //myAudioSource.Stop();
        //running=false;
        //myAudioSource.volume=1.5;
        this.coinSource3.loop = false;
        this.coinSource3.volume = 0.7f;
        this.coinSource3.pitch = Random.Range(1f, 1.5f);
        this.coinSource3.clip = this.hurt;
        this.coinSource3.time = 0;
        this.coinSource3.Play();
    }

    public virtual void PlayHurtSound2()
    {
        //myRunningTime=myAudioSource.time;
        //myAudioSource.Stop();
        //running=false;
        //myAudioSource.volume=1.5;
        this.coinSource3.loop = false;
        this.coinSource3.volume = 0.7f;
        this.coinSource3.pitch = 0.5f;
        this.coinSource3.clip = this.hurt;
        this.coinSource3.time = 0;
        this.coinSource3.Play();
    }

    public virtual void PlayJumpSound()
    {
        if (this.car)
        {
            this.myAudioSource.pitch = 1;
            this.myAudioSource.volume = 0.1f;
            return;
        }
        this.myRunningTime = this.myAudioSource.time;
        this.myAudioSource.Stop();
        this.running = false;
        this.myAudioSource.volume = 1.5f;
        this.myAudioSource.loop = false;
        this.myAudioSource.pitch = Random.Range(1f, 2.1f);
        this.myAudioSource.clip = this.myJumpSound;
        this.myAudioSource.time = 0;
        this.myAudioSource.Play();
    }

    public virtual void SetArtSize(float f)
    {

        {
            float _315 = this.artSize * f;
            Vector3 _316 = this.myArt.localScale;
            _316.x = _315;
            this.myArt.localScale = _316;
        }

        {
            float _317 = this.artSize * f;
            Vector3 _318 = this.myArt.localScale;
            _318.y = _317;
            this.myArt.localScale = _318;
        }

        {
            float _319 = this.artSize;
            Vector3 _320 = this.myArt.localScale;
            _320.z = _319;
            this.myArt.localScale = _320;
        }
    }

    //燃料耗尽
    public virtual void LowFuel()
    {
        this.thisSpaceship.LowFuel();
        this.myAudioSource.pitch = 0.7f;
        this.lowFuel = true;
        this.trailRenderer.enabled = false;
    }

    public virtual void FixedUpdate()//else if(myRigidbody.velocity.sqrMagnitude<0.01){ myRigidbody.velocity*=1.005; }
    {
        //myTrail.position=myTransform.position;
        if (this.dead)
        {
            return;
        }
        if (this.spaceshipMode)
        {
            if (this.spaceshipCanFly)
            {
                //spaceshipGo.z=myTransform.position.z;
                //spaceshipGo.x=myTransform.position.x+1;
                if (this.shipHit)
                {
                    this.spaceshipGo.y = this.spaceshipGo.y - (1.3f * Time.smoothDeltaTime);
                    this.spaceshipGo.z = this.myTransform.position.z;
                    this.spaceshipGo.x = this.myTransform.position.x + 1;
                    this.myTransform.rotation = Quaternion.Lerp(this.myTransform.rotation, Quaternion.FromToRotation(Vector3.right, new Vector3(this.spaceshipGo.x, this.spaceshipGo.y, this.spaceshipGo.z) - this.spaceship.position), 10 * Time.smoothDeltaTime);
                    this.myRigidbody.velocity = this.myTransform.TransformDirection(Vector3.right) * 2.5f;
                    return;
                }
                if (this.lowFuel)
                {
                    this.spaceshipGo.y = this.SNFloatLerp(this.spaceshipGo.y, 0, 10 * Time.smoothDeltaTime);
                    this.spaceshipGo.z = this.myTransform.position.z;
                    this.spaceshipGo.x = this.myTransform.position.x + 1;
                    this.myTransform.rotation = Quaternion.Lerp(this.myTransform.rotation, Quaternion.FromToRotation(Vector3.right, new Vector3(this.spaceshipGo.x, this.spaceshipGo.y, this.spaceshipGo.z) - this.spaceship.position), 0.2f * Time.smoothDeltaTime);
                    if (!this.demoEnd)
                    {
                        this.myRigidbody.velocity = this.myTransform.TransformDirection(Vector3.right) * 2.5f;
                    }
                    else
                    {
                        this.myRigidbody.velocity = this.myTransform.TransformDirection(Vector3.right) * 6;
                    }
                    return;
                }
                else
                {
                    if (this.canDrive)
                    {
                        if (this.player2 && (this.jumpButton == this.stay))
                        {
                            if (this.spaceshipGo.y < 1.2f)
                            {
                                if (!this.spaceshipFlip)
                                {
                                    this.thisSpaceship.Flip(true);
                                    //myAudioSource.pitch*=-1;
                                    this.spaceshipFlip = true;
                                }
                                this.spaceshipGo.y = this.spaceshipGo.y + this.shipHandling;
                            }
                        }
                        else
                        {
                            if (Player.isplayer1 && (this.jumpButton == this.stay))
                            {
                                if (this.spaceshipGo.y < 1.2f)
                                {
                                    if (!this.spaceshipFlip)
                                    {
                                        this.thisSpaceship.Flip(true);
                                        //myAudioSource.pitch*=-1;
                                        this.spaceshipFlip = true;
                                    }
                                    this.spaceshipGo.y = this.spaceshipGo.y + this.shipHandling;
                                }
                            }
                            else
                            {
                                if (this.spaceshipFlip)
                                {
                                    this.thisSpaceship.Flip(false);
                                    //myAudioSource.pitch*=-1;
                                    this.spaceshipFlip = false;
                                }
                                if (this.spaceshipGo.y > -1.2f)
                                {
                                    this.spaceshipGo.y = this.spaceshipGo.y - this.shipHandling;
                                }
                            }
                        }
                        this.spaceshipGo.z = this.myTransform.position.z;
                        this.spaceshipGo.x = this.myTransform.position.x + 1;
                        this.myTransform.rotation = Quaternion.Lerp(this.myTransform.rotation, Quaternion.FromToRotation(Vector3.right, new Vector3(this.spaceshipGo.x, this.spaceshipGo.y, this.spaceshipGo.z) - this.spaceship.position), 10 * Time.smoothDeltaTime);
                        if (this.player2)
                        {
                            if (this.player1.position.x > (this.myTransform.position.x + 0.8f))
                            {
                                this.myLastVelocity = this.myTransform.TransformDirection(Vector3.right) * 2.8f;
                            }
                            else
                            {
                                if (this.player1.position.x < (this.myTransform.position.x - 0.8f))
                                {
                                    this.myLastVelocity = this.myTransform.TransformDirection(Vector3.right) * 2.3f;
                                }
                                else
                                {
                                    this.myLastVelocity = this.myTransform.TransformDirection(Vector3.right) * 2.5f;
                                }
                            }
                        }
                        else
                        {
                            this.myLastVelocity = this.myTransform.TransformDirection(Vector3.right) * 2.5f;
                        }
                        this.myRigidbody.velocity = this.myLastVelocity;
                        return;
                    }
                    else
                    {
                        if (this.myRigidbody.velocity.x >= 1)
                        {
                            this.thisSpaceship.Fly();
                            this.canDrive = true;
                            return;
                        }
                        else
                        {

                            {
                                float _321 = this.SNFloatLerp(this.myRigidbody.velocity.x, 2.5f, 0.6f * Time.smoothDeltaTime);
                                Vector3 _322 = this.myRigidbody.velocity;
                                _322.x = _321;
                                this.myRigidbody.velocity = _322;
                            }
                            return;
                        }
                    }
                }
            }
            else
            {
                this.spaceshipCanFly = this.gamegod.ActivateSpaceShipMode();
                this.isHome = false; //You cant be home if you've just entered a space ship
                if (this.spaceshipCanFly)
                {
                    this.myRigidbody.isKinematic = false;
                }
                return;
            }
        }
        else
        {
            if (this.touchingPlanet)
            {
                this.myRigidbody.velocity = new Vector3(0, 0, 0);
                if (Physics.Raycast(this.myTransform.position, this.planetNormal, out this.hit, this.myHeight * 1.4f, (int) this.planetMask))
                {
                    this.lastNormal = this.planetNormal;
                    this.planetNormal = -this.hit.normal;
                    this.planetNormal.z = 0;
                    if (this.asteroid || this.physicsObject)
                    {
                        Vector3 hitPoint = this.hit.point;
                        //Physics.Raycast (myTransform.position+myRigidbody.velocity*0.2, planetNormal, hit, myTransform.lossyScale.y*1.8, 1<<18);
                        //planetNormal=SNVector3Lerp(planetNormal,-hit.normal,0.5);
                        this.planetNormal = this.SNVector3Lerp(this.planetNormal, this.lastNormal, 0.5f);
                        this.myTransform.position = this.SNVector3Lerp(this.myTransform.position, hitPoint - (this.planetNormal * (this.myHeight - 0.02f)), 30 * Time.smoothDeltaTime);
                        //myTransform.position.z=myZ;
                        this.myTransform.rotation = Quaternion.Lerp(this.myTransform.rotation, Quaternion.LookRotation(Vector3.forward, -new Vector3(this.planetNormal.x, this.planetNormal.y, 0)), 10 * Time.smoothDeltaTime);
                    }
                    else
                    {
                        this.myTransform.rotation = Quaternion.LookRotation(Vector3.forward, -new Vector3(this.planetNormal.x, this.planetNormal.y, 0));
                    }
                    //hit=null;
                    this.RunPlanet();
                }
                else
                {
                    this.touchingPlanet = false;
                    this.StartCoroutine(this.Jump2());
                }
            }
            else
            {
                if (this.physicsFrame >= 8)
                {
                    this.currentForce = this.PhysicsHere();
                    this.physicsFrame = 0;
                }
                else
                {
                    if (this.evaluateFrame >= 16)
                    {
                        this.RecalculateNearestPlanet();
                        this.evaluateFrame = 0;
                    }
                    else
                    {
                        this.PlanetPull(this.currentForce);
                        this.physicsFrame++;
                        this.evaluateFrame++;
                    }
                }
                this.myLastVelocity = this.myRigidbody.velocity;
            }
        }
        if (this.myRigidbody.velocity.x > this.velocityLimit)
        {

            {
                float _323 = this.velocityLimit;
                Vector3 _324 = this.myRigidbody.velocity;
                _324.x = _323;
                this.myRigidbody.velocity = _324;
            }
        }
        else
        {
            if (this.myRigidbody.velocity.x < -this.velocityLimit)
            {

                {
                    float _325 = -this.velocityLimit;
                    Vector3 _326 = this.myRigidbody.velocity;
                    _326.x = _325;
                    this.myRigidbody.velocity = _326;
                }
            }
        }
        if (this.myRigidbody.velocity.y > this.velocityLimit)
        {

            {
                float _327 = this.velocityLimit;
                Vector3 _328 = this.myRigidbody.velocity;
                _328.y = _327;
                this.myRigidbody.velocity = _328;
            }
        }
        else
        {
            if (this.myRigidbody.velocity.y < -this.velocityLimit)
            {

                {
                    float _329 = -this.velocityLimit;
                    Vector3 _330 = this.myRigidbody.velocity;
                    _330.y = _329;
                    this.myRigidbody.velocity = _330;
                }
            }
        }
    }

    public virtual void RunPlanet()
    {
        //myTransform.position.x=hit.point.x;
        //myTransform.position.y=hit.point.y;
        if (this.inStore)
        {
            return;
        }
        if (!this.running)
        {
            this.running = true;
            this.PlayRunningSound();
        }
        if (!this.car)
        {
            if (this.asteroid)
            {
                this.myRigidbody.velocity = new Vector3(-this.planetNormal.y, this.planetNormal.x, 0) * 0.65f;
            }
            else
            {
                if (this.physicsObject)
                {
                    this.myRigidbody.velocity = new Vector3(-this.planetNormal.y, this.planetNormal.x, 0) * 0.5f;
                }
                else
                {
                    this.myRigidbody.velocity = new Vector3(-this.planetNormal.y, this.planetNormal.x, 0) * 0.75f;
                }
            }
        }
        else
        {
            if (!this.asteroid)
            {
                this.myRigidbody.velocity = new Vector3(-this.planetNormal.y, this.planetNormal.x, 0) * 1.7f;
            }
            else
            {
                this.myRigidbody.velocity = new Vector3(-this.planetNormal.y, this.planetNormal.x, 0);
            }
        }
        if (this.inverted)
        {
            this.myRigidbody.velocity = this.myRigidbody.velocity * -1;
        }
        //myTransform.position+=Vector3(-planetNormal.y,-planetNormal.x)*0.01;
        //touchingPlanet=true;
        if (this.asteroid)
        {
            this.myRigidbody.AddForce(this.planetNormal * 8);
        }
        else
        {
            if (this.physicsObject)
            {
                this.myRigidbody.AddForce(this.planetNormal * 3);
            }
            else
            {
                this.myRigidbody.AddForce(this.planetNormal * 7);
            }
        }
    }

    public virtual void OnApplicationPause()
    {
    }

    public virtual void OnApplicationFocus()
    {
        if (this.isPause)
        {
            this.isPause = false;
        }
        else
        {
            this.isPause = true;
        }
    }

    private bool _IsEscButtonDown;
    public virtual void Update()
    {
        if (!this.gamegod.enterStoreClicked && !GameGod.gamePaused)
        {
            bool isInMainMenu = Application.loadedLevelName == "MainMenu";
            if ((Input.GetKeyDown(KeyCode.Escape) && (this._IsEscButtonDown == false)) && (isInMainMenu == false))
            {
                this._IsEscButtonDown = true;
                this.gamegod.justBuy = false;
                this.gamegod.pauseToBuy("退出", 23);
            }
            if (Input.GetKeyUp(KeyCode.Escape))
            {
                this._IsEscButtonDown = false;
            }
        }
        if (this.spriteOn)
        {
            this.myArt.position = this.myTransform.TransformPoint(this.localArtPosition);
            this.myArt.rotation = this.myTransform.rotation;
            this.myShadow.position = this.myTransform.TransformPoint(this.localShadowPosition);
            this.myShadow.rotation = this.myTransform.rotation;
        }
        else
        {
            this.myArt.position = new Vector3(10, 10, 0);
            this.myShadow.position = new Vector3(10, 10, 0);
        }
        if (this.dead)
        {
            this.myRigidbody.AddForce(new Vector3(0, -2, 0));

            {
                float _331 = 1.034759f;
                Vector3 _332 = this.myArt.position;
                _332.z = _331;
                this.myArt.position = _332;
            }
            return;
        }
        this.continueRunning = false;
        if (this.trailRenderer.time != this.trailWidth)
        {
            this.trailRenderer.time = this.SNFloatLerp(this.trailRenderer.time, this.trailWidth, 2 * Time.smoothDeltaTime);
        }
        this.jumpButton = this.none;
        //接收输入来控制玩家
        if (this.lookForControls)
        {
            if (!this.runningOnIphone)
            {
                this.PCcontrols();
            }
            else
            {
                if (!this.multiplayer)
                {
                    Player.isplayer1 = true;
                    this.iPhoneControls();
                }
                else
                {
                    if (this.player2)
                    {
                        this.iPhoneControlsPlayer2();
                    }
                    else
                    {
                        Player.isplayer1 = true;
                        this.StartCoroutine(this.iPhoneControlsPlayer1());
                    }
                }
            }
        }
        if (this.spaceshipMode)
        {
            if (!this.lowFuel)
            {
                this.myAudioSource.pitch = 3 - Mathf.Abs(this.myLastVelocity.y * 0.5f);
            }
            if (this.trailWidth != 0)
            {
                this.trailWidth = 0;
            }
            return;
        }
        else
        {
            if (!this.touchingPlanet)
            {
                //trailWidth=0.15;
                if (this.running)
                {
                    this.running = false;
                    this.StopRunningSound();
                }
                //if(MathAbs(myTransform.position.y)>1.8) { 
                //myRigidbody.AddForce(Vector3(myTransform.position.x,0,myTransform.position.z)-myTransform.position);	
                //}
                if (Physics.Raycast(this.myTransform.position, this.myRigidbody.velocity, out this.hit, 5, (int) this.planetMask))
                {
                    this.myTransform.rotation = Quaternion.Lerp(this.myTransform.rotation, Quaternion.LookRotation(Vector3.forward, -this.myRigidbody.velocity), 4 * Time.smoothDeltaTime);
                    this.hitDistance = this.SqrMagnitude2d(this.myTransform.position - this.hit.point);
                    if (!this.jetpackOn && (this.hitDistance < 0.16f))
                    {
                        //body.AddForce(-Vector3(hit.normal.x,-hit.normal.y,0)*0.01);
                        this.chosenPlanet = this.hit.transform;
                        this.hasChosenPlanet = true;
                    }
                    else
                    {
                        if (this.hitDistance < 0.49f)
                        {
                            this.myRigidbody.AddForce((this.hit.transform.position - this.myTransform.position) * 0.0005f);
                        }
                    }
                }
                else
                {
                    //if(hitDistance<0.4){ myRigidbody.AddForce(Subtract2d(hit.transform.position,myTransform.position)*0.001); }
                    this.hasChosenPlanet = false;
                }
                if (this.jumpCounter < 0.2f)
                {
                    this.jumpCounter = Time.time - this.jumpTime;
                }
                else
                {
                    if (this.jumped)
                    {
                        this.jumped = false;
                        this.physicsFrame = 8;
                        this.runParticles.Stop();
                        this.runParticlesBool = false;
                        if (this.trailRenderer.time != 1.5f)
                        {
                            this.trailRenderer.time = 1.5f;
                        }
                        if (this.trailWidth != 2)
                        {
                            this.trailWidth = 2;
                        }
                    }
                    if (this.jumpButton == this.stay)
                    {
                        this.JetPack(true);
                    }
                    else
                    {
                        if (this.jumpButton == this.end)
                        {
                            this.JetPack(false);
                        }
                        else
                        {
                            if (this.doubleJump)
                            {
                                if (this.jumpButton == this.start)
                                {
                                    this.AirJump(); //DOUBLE JUMP
                                }
                            }
                        }
                    }
                }
            }
            else
            {
                if (this.hasChosenPlanet)
                {
                    this.hasChosenPlanet = false;
                }
                if (!this.runParticlesBool)
                {
                    if (this.car)
                    {
                        this.runParticles.Play();
                        this.runParticlesBool = true;
                    }
                    else
                    {
                        if (!this.asteroid && !this.physicsObject)
                        {
                            this.runParticles.Play();
                            this.runParticlesBool = true;
                        }
                    }
                }
                if (this.trailWidth != 0)
                {
                    this.trailWidth = 0;
                }
                if (this.jumpButton == this.start)
                {
                    this.Jump();
                }
            }
        }
    }

    public virtual void PCcontrols()
    {
        if (!this.beCtrl)
        {
            return;
        }
        if (this.gamegod.caught)
        {
            return;
        }
        if (this.forceGuide)
        {
            return;
        }
        if (Input.GetKeyDown(KeyCode.B) && this.didTap)
        {
            this.gamegod.pauseToGetBox(); //空降宝箱
            return;
        }
        if (Input.GetKeyDown(KeyCode.U) && this.didTap)
        {
            this.gamegod.UnpauseGame(); //不暂停
            return;
        }
        if (Input.GetKeyDown(KeyCode.Escape) && this.didTap) //暂停
        {
            this.gamegod.PauseGame();
            return;
        }
        if (Input.GetKeyDown(KeyCode.O))
        {
            //gamegod.ShowFestivalGiftBy(true); //显示节日礼包
            // gamegod.ShowRentCarPage();
            this.gamegod.XszyTrigger(2);
        }
        if (Input.GetKeyDown(KeyCode.Space)) //马上死
        {
            this.DieNow();
        }
        //上方向键控制玩家1
        if (!this.player2)
        {
            Player.isplayer1 = true;
            if (Input.GetKeyDown(KeyCode.UpArrow))
            {
                this.jumpButton = this.start;
                return;
            }
            else
            {
                if (Input.GetKeyUp(KeyCode.UpArrow))
                {
                    this.jumpButton = this.end;
                    return;
                }
                else
                {
                    if (Input.GetKey(KeyCode.UpArrow))
                    {
                        this.jumpButton = this.stay;
                        return;
                    }
                    else
                    {
                        this.jumpButton = this.none;
                        return;
                    }
                }
            }
        }
        else
        {
            //X键控制玩家2
            if (Input.GetKeyDown(KeyCode.X))
            {
                this.jumpButton = this.start;
                return;
            }
            else
            {
                if (Input.GetKeyUp(KeyCode.X))
                {
                    this.jumpButton = this.end;
                    return;
                }
                else
                {
                    if (Input.GetKey(KeyCode.X))
                    {
                        this.jumpButton = this.stay;
                        return;
                    }
                    else
                    {
                        this.jumpButton = this.none;
                    }
                }
            }
        }
    }

    public virtual IEnumerator SetColliderActive()
    {
        float timing = Time.time;
        while ((Time.time - timing) < 0.05f)
        {
            yield return null;
        }
        this.myCollider.enabled = true;
    }

    public virtual void iPhoneControls()
    {
        if (!this.beCtrl)
        {
            return;
        }
        if (Input.touchCount == 1)
        {
            Player.isplayer1 = true;
            this.touch1 = Input.GetTouch(0);
            if (this.forceGuide)
            {
                return;
            }
            if (this.gamegod.caught)
            {
                return;
            }
            if (this.touch1.position.y > this.pausePos.y)
            {
                if ((this.touch1.position.x > this.pausePos.x) && (this.touch1.position.x < this.pausePos.z))
                {
                    this.gamegod.PauseGame();
                    return;
                }
            }
            if (this.touch1.phase == TouchPhase.Began)
            {
                this.jumpButton = this.start;
                return;
            }
            else
            {
                if (this.touch1.phase == TouchPhase.Ended)
                {
                    this.jumpButton = this.end;
                    return;
                }
                else
                {
                    if (this.touch1.phase == TouchPhase.Moved)
                    {
                        this.jumpButton = this.stay;
                        return;
                    }
                    else
                    {
                        if (this.touch1.phase == TouchPhase.Stationary)
                        {
                            this.jumpButton = this.stay;
                            return;
                        }
                        else
                        {
                            this.jumpButton = this.none;
                        }
                    }
                }
            }
        }
        else
        {
            this.jumpButton = this.none;
        }
    }

    //手机上玩家2的控制
    public virtual void iPhoneControlsPlayer2()
    {
        if (Input.touchCount > 0)
        {
            this.touchCounter = 0;
            while ((this.touchCounter < Input.touchCount) && (this.jumpButton == this.none))
            {
                this.touch1 = Input.GetTouch(this.touchCounter);
                if (this.forceGuide)
                {
                    return;
                }
                if (this.gamegod.caught)
                {
                    return;
                }
                if (this.touch1.position.x > this.halfScreen)
                {
                    if (this.touch1.phase == TouchPhase.Began)
                    {
                        this.jumpButton = this.start;
                        return;
                    }
                    else
                    {
                        if (this.touch1.phase == TouchPhase.Ended)
                        {
                            this.jumpButton = this.end;
                            return;
                        }
                        else
                        {
                            if (this.touch1.phase == TouchPhase.Moved)
                            {
                                this.jumpButton = this.stay;
                                return;
                            }
                            else
                            {
                                if (this.touch1.phase == TouchPhase.Stationary)
                                {
                                    this.jumpButton = this.stay;
                                    return;
                                }
                                else
                                {
                                    this.jumpButton = this.none;
                                }
                            }
                        }
                    }
                }
                this.touchCounter++;
            }
        }
        else
        {
            this.jumpButton = this.none;
        }
    }

    //手机上玩家1的控制
    public virtual IEnumerator iPhoneControlsPlayer1()
    {
        if (!this.beCtrl)
        {
            yield break;
        }
        if (Input.touchCount > 0)
        {
            this.touchCounter = 0;
            while ((this.touchCounter < Input.touchCount) && (this.jumpButton == this.none))
            {
                this.touch1 = Input.GetTouch(this.touchCounter);
                //体力值值购买位置
                if (this.forceGuide)
                {
                    yield break;
                }
                if (this.gamegod.caught)
                {
                    yield break;
                }
                //pause game
                if (this.touch1.position.y > this.pausePos.y)
                {
                    if ((this.touch1.position.x > this.pausePos.x) && (this.touch1.position.x < this.pausePos.z))
                    {
                        if (this.didTap)
                        {
                            this.gamegod.PauseGame();
                        }
                        yield break;
                    }
                }
                if (this.touch1.position.x < this.halfScreen)
                {
                    if (this.touch1.phase == TouchPhase.Began)
                    {
                        this.jumpButton = this.start;
                    }
                    else
                    {
                        if (this.touch1.phase == TouchPhase.Ended)
                        {
                            this.jumpButton = this.end;
                        }
                        else
                        {
                            if (this.touch1.phase == TouchPhase.Moved)
                            {
                                this.jumpButton = this.stay;
                            }
                            else
                            {
                                if (this.touch1.phase == TouchPhase.Stationary)
                                {
                                    this.jumpButton = this.stay;
                                }
                                else
                                {
                                    this.jumpButton = this.none;
                                }
                            }
                        }
                    }
                }
                this.touchCounter++;
            }
        }
        else
        {
            this.jumpButton = this.none;
        }
        // return UnityScript.Lang.UnityRuntimeServices.EmptyEnumerator;
        // return null;
        yield break;
    }

    public virtual IEnumerator SuperGravity(Vector3 v)
    {
        float timeri = 0.0f;
        this.superGravity = true;
        this.touchingPlanet = false;
        this.myRigidbody.AddForce(-this.planetNormal * 20);
        while (this.superGravity)
        {
            this.myRigidbody.AddForce((v - this.myTransform.position) * 30);
            timeri = timeri + Time.deltaTime;
            if (timeri > 0.15f)
            {
                this.superGravity = false;
            }
            yield return null;
        }
    }

    public virtual void PlanetPull(Vector3 v)
    {
        if (!this.touchingPlanet && (this.jumpCounter > 0.2f))
        {
            //bodyToPlanet = (v - myTransform.position);
            //distanceToBody = bodyToPlanet.sqrMagnitude;
            //myRigidbody.AddForce(bodyToPlanet/distanceToBody*m*planetGravity);
            if (!this.hasChosenPlanet)
            {
                this.myRigidbody.AddForce(v * this.planetGravity);
            }
            else
            {
                this.myRigidbody.AddForce(-this.myLastVelocity * 0.35f);
                Vector3 bodyToPlanet = this.chosenPlanet.position - this.myTransform.position;
                float  distanceToBody = bodyToPlanet.sqrMagnitude;
                this.myRigidbody.AddForce((bodyToPlanet / distanceToBody) * this.planetGravity);
            }
        }
    }

    public virtual void JetPack(bool turnOn)
    {
        if (turnOn)
        {
            if (!this.jetpackOn)
            {
                this.myRigidbody.velocity = this.myRigidbody.velocity * 1.4f;
                this.planetGravity = 0.57f;
                this.jetpackOn = true;
                this.hasChosenPlanet = false;
                if (!this.car)
                {
                    // this.myJetPackFire.emit = true;
                    // this.myJetPackFireInstance.Play();
                }
                return;
            }
        }
        else
        {
            if (this.jetpackOn)
            {
                this.planetGravity = 0.9f;
                this.myRigidbody.velocity = this.myRigidbody.velocity / 1.4f;
                this.myLastVelocity = this.myRigidbody.velocity;
                this.RecalculateNearestPlanet();
            }
            this.jetpackOn = false;
            // this.myJetPackFire.emit = false;
            // this.myJetPackFireInstance.Stop();
            return;
        }
    }

    public virtual IEnumerator OverridePosition(Vector3 v)//Blink();	
    {
        this.trailRenderer.enabled = false;
        this.myTransform.position = new Vector3(v.x, v.y, this.myTransform.position.z);
        // return UnityScript.Lang.UnityRuntimeServices.EmptyEnumerator;
        yield break;
    }

    public virtual void AirJump()
    {
        if (this.menuVersion)
        {
            return;
        }
        if (this.airJump)
        {
            return;
        }
        else
        {
            this.airJump = true;
        }
        this.hasChosenPlanet = false;
        if (this.player2)
        {
            PayAndroid.Player2IsDoubleJumping = true;
        }
        this.PlayJumpSound();
        this.myAnimation.GetComponent<Animation>().Play("Jump");
        //SmokeParticlesTurnOff();
        //myRigidbody.velocity=Vector3(0,0,0);
        this.myCollider.enabled = false;
        this.myRigidbody.velocity = this.Multiply2d(this.myRigidbody.velocity, 0.3f);
        this.myRigidbody.AddForce(-this.planetNormal * 23);
        this.myLastVelocity = this.myRigidbody.velocity;
        this.RecalculateNearestPlanet();
        this.physicsFrame = 0;
        this.jumped = true;
        this.StartCoroutine(this.SetColliderActive());
    }

    public virtual void Jump()
    {
        if (this.menuVersion)
        {
            return;
        }
        if (this.shouldArrow)
        {
            this.tutArrowR.enabled = false;
        }
        if (this.currentPower == this.hook)
        {
            this.hookGO.TurnOn();
            this.hookGO.GetComponent<Animation>().Play();
            this.jumpCounter = 0;
            return;
        }
        this.offAir = Time.realtimeSinceStartup;
        this.hasChosenPlanet = false;
        this.airJump = false;
        this.gamegod.ReportEvent(888, 4, 0);
        if (this.multiplayer)
        {
            if (!this.didTap)
            {
                this.tapheremenu1.gameObject.SetActive(false);
                this.tapheremenu2.gameObject.SetActive(false);
                this.tapheremenu3.gameObject.SetActive(false);
                this.didTap = true;
            }
        }
        if (this.currentPower != this.boomJetpack)
        {

            {
                float _333 = this.hit.point.x;
                Vector3 _334 = this.mySmoke.position;
                _334.x = _333;
                this.mySmoke.position = _334;
            }

            {
                float _335 = this.hit.point.y;
                Vector3 _336 = this.mySmoke.position;
                _336.y = _335;
                this.mySmoke.position = _336;
            }
            this.mySmoke.position = this.mySmoke.position - (this.hit.normal * 0.05f);
            this.mySmokeP.Play();
            this.mySmoke.rotation = this.myTransform.rotation;
        }
        else
        {
            if (this.mineCounter < this.mines.Length)
            {
                if (this.asteroid)
                {
                    this.StartCoroutine(this.mines[this.mineCounter].Place(this.lastPlanet, this.myTransform.TransformPoint(new Vector3(0, -1, 0)), this.myTransform.rotation, this.hit.normal));
                }
                else
                {
                    this.StartCoroutine(this.mines[this.mineCounter].Place(this.lastPlanet, this.myTransform.TransformPoint(new Vector3(0, -1, 0)), this.myTransform.rotation, this.hit.normal));
                }
                this.mineCounter++;
            }
            else
            {
                this.mineCounter = 0;
                if (this.asteroid)
                {
                    this.StartCoroutine(this.mines[this.mineCounter].Place(this.lastPlanet, this.myTransform.TransformPoint(new Vector3(0, -1, 0)), this.myTransform.rotation, this.hit.normal));
                }
                else
                {
                    this.StartCoroutine(this.mines[this.mineCounter].Place(this.lastPlanet, this.myTransform.TransformPoint(new Vector3(0, -1, 0)), this.myTransform.rotation, this.hit.normal));
                }
                this.mineCounter++;
            }
        }
        if (this.player2)
        {
            PayAndroid.Player2IsJumping = true;
        }
        this.PlayJumpSound();
        this.trailRenderer.enabled = true;
        if (this.car)
        {
            this.PlaySound(this.carSound, 1.5f, 0.5f);
        }
        this.touchingPlanet = false;
        this.jumpCounter = 0;
        this.jumpTime = Time.time;
        if (!this.jumped)
        {
            this.myAnimation.GetComponent<Animation>().Play("Jump");
            //SmokeParticlesTurnOff();
            //myRigidbody.velocity=Vector3(0,0,0);
            if (this.asteroid)
            {
                this.currentPlanet.AddForce(this.planetNormal * 100);
            }
            else
            {
                this.currentPlanet.AddForce(this.planetNormal * 200);
            }
            this.myCollider.enabled = false;
            this.myTransform.position = this.myTransform.position - (this.planetNormal * 0.04f);
            this.myRigidbody.velocity = this.Multiply2d(this.myRigidbody.velocity, 0.3f);
            if (!this.asteroid)
            {
                this.myRigidbody.AddForce(-this.planetNormal * 30);
            }
            else
            {
                this.myRigidbody.AddForce(-this.planetNormal * 18);
            }
            this.jumpLine = this.myTransform.position.y + (this.planetNormal.y * 0.3f);
            //myRigidbody.AddForce(myTransform.InverseTransformDirection(Vector3(-20,0,00)));
            this.myLastVelocity = this.myRigidbody.velocity;
            this.RecalculateNearestPlanet();
            this.touchingPlanet = false;
            this.physicsFrame = 0;
            this.jumped = true;
            this.StartCoroutine(this.SetColliderActive());
        }
    }

    public virtual IEnumerator Jump2()
    {
        this.hasChosenPlanet = false;
        this.myAnimation.GetComponent<Animation>().Play("Jump");
        this.touchingPlanet = false;
        this.jumpCounter = 0;
        this.jumpTime = Time.time;
        this.physicsFrame = 0;
        this.jumped = true;
        yield return null;
        this.myLastVelocity = -this.planetNormal;
        this.jumpLine = this.myTransform.position.y + (this.planetNormal.y * 0.3f);
        this.RecalculateNearestPlanet();
    }

    public virtual Vector3 GetTangentVector(Vector3 where)
    {
        if (where.y > 0)
        {
            if (where.x > 0)
            {
                where = Vector3.Lerp(where, new Vector3(where.y, -where.x, where.z), 0.5f);
            }
            else
            {
                where = Vector3.Lerp(where, new Vector3(-where.y, where.x, where.z), 0.5f);
            }
        }
        else
        {
            if (where.x < 0)
            {
                where = Vector3.Lerp(where, new Vector3(where.y, -where.x, where.z), 0.5f);
            }
            else
            {
                where = Vector3.Lerp(where, new Vector3(-where.y, where.x, where.z), 0.5f);
            }
        }
        return where;
    }

    /*function Orbit(){
	if(counter==16){
		counter=0;
		thisPlanetGravity=Vector3(0,0,0);
	}
	else {
		if (Physics.Raycast (myTransform.position, VectorForThisTurn(counter), hit, planetGravity, 1<<18)) {
		 	thisGravity=-hit.normal*3;
		 	thisGravity.z=0;
		}
		else if (Physics.Raycast (myTransform.position, VectorForThisTurn(counter), hit, 1, 1<<18)) {
		 	thisGravity=-hit.normal*5;
		 	thisGravity.z=0;
		}
	}
	
	//myRigidbody.AddForce((hit.normal)*0.4);
	thisPlanetGravity=thisGravity*(planetGravity-hit.distance);
	myRigidbody.AddForce(thisPlanetGravity);
	counter++;
}*/
    public virtual void OnCollisionEnter(Collision collision)
    {
        Vector3 vectorTemp = default(Vector3);
        this.thisGO = collision.gameObject;
        GameObject lastGO = this.thisGO;
        switch (this.thisGO.layer)
        {
            case 18://Planetoid
                if (!this.spaceshipMode)
                {
                    if (!this.touchingPlanet || this.physicsObject)
                    {
                        this.gamegod.InformDirection(this.myLastVelocity.x);
                        this.runParticles.Stop();
                        bool runParticlesBoolean = false;
                        this.currentPlanet = this.thisGO.GetComponent<Rigidbody>();
                        this.myAnimation.GetComponent<Animation>().Stop();
                        this.myAnimation.GetComponent<Animation>().Play("Jump2");
                        this.animState = this.myAnimation.GetComponent<Animation>().PlayQueued("run");
                        this.animState.speed = 1.6f;
                        this.animState = null;
                        this.myPlanet = collision.transform;
                        this.lastPlanet = this.myPlanet;
                        //myPower.animation.Play();
                        this.touchingPlanet = true;
                        this.superGravity = false;
                        if (this.currentPower == this.hook)
                        {
                            this.hookGO.TurnOn();
                        }
                        if (this.shouldArrow)
                        {
                            this.tutArrowR.enabled = true;
                        }
                        if (this.offAir == 0)
                        {
                            this.offAir = Time.realtimeSinceStartup;
                        }
                        this.gamegod.ReportEvent(7, (int) (1.5f * (Time.realtimeSinceStartup - this.offAir)), 0);
                        this.JetPack(false);
                        if (this.player2)
                        {
                            if (PayAndroid.Player2IsJumping)
                            {
                                PayAndroid.Player2jumpButton = 0;
                            }
                            PayAndroid.Player2IsJumping = false;
                        }
                        this.planetNormal = collision.contacts[0].normal;
                        /*if(myLastVelocity.x>0){DynamicDirection(1);}
				else{DynamicDirection(-1);}*/
                        if (this.thisGO.name == "a")
                        {
                            this.asteroid = true;
                            this.physicsObject = false;
                        }
                        else
                        {
                            this.asteroid = false;
                        }
                        if (!this.asteroid)
                        {
                            if (this.thisGO.name == "b")
                            {
                                this.physicsObject = true;
                                this.currentPlanet.angularVelocity = new Vector3(0, 0, 0);
                            }
                            else
                            {
                                this.physicsObject = false;
                                this.runParticles.Play();
                            }
                        }
                        if (!this.asteroid)
                        {
                            this.planetNormal = new Vector3(this.myPlanet.position.x, this.myPlanet.position.y, this.myTransform.position.z) - this.myTransform.position;
                        }
                        else
                        {
                            //planetNormal=myPlanet.position-myTransform.position;
                            this.planetNormal = -collision.contacts[0].normal;
                            if (!Physics.Raycast(this.myTransform.position, this.planetNormal, this.myHeight + 0.3f, 1 << 18))
                            {
                                this.planetNormal = -this.planetNormal;
                            }
                        }
                        /*if (Physics.Raycast (myTransform.position, myPlanet.position-myTransform.position, hit,1, 1<<18)) {
					//planetNormal=-hit.normal;
					planetNormal=myPlanet.position-myTransform.position;
				}
				else{
					//planetNormal=-collision.contacts[0].normal;
					planetNormal=myPlanet.position-myTransform.position;
				}
				planetNormal=-collision.contacts[0].normal;
				*/
                        this.jumped = false;
                        this.myTransform.rotation = Quaternion.Lerp(this.myTransform.rotation, Quaternion.FromToRotation(Vector3.down, new Vector3(this.planetNormal.x, this.planetNormal.y, 0)), 0.2f);
                        this.runDirection = Vector3.right;
                        this.myRigidbody.velocity = new Vector3(0, 0, 0);
                        this.myPlanet = null;
                        this.thisGO = null;
                        return;
                    }
                }
                else
                {
                    if (this.thisGO.name == "a")
                    {
                        this.asteroid = true;
                    }
                    else
                    {
                        this.asteroid = false;
                    }
                    if (!this.asteroid && this.spaceshipCanFly)
                    {
                        this.myPlanet = collision.transform;
                        this.lastPlanet = this.myPlanet;
                        this.touchingPlanet = true;
                        this.DeactivateSpaceShipMode(collision.transform, -collision.contacts[0].normal, collision.contacts[0].point);
                    }
                    this.thisGO = null;
                    return;
                }
                break;
            case 17://Physics Body（比如篮球，打一次就有一个金币奖励）
                if (!this.spaceshipMode)
                {
                    this.thisRigidbody = collision.rigidbody;
                    this.thisRigidbody.AddForce(this.myRigidbody.velocity * 80);
                    vectorTemp = collision.transform.position;
                    if (this.isHome)
                    {
                        this.PlayCoinSound();

                        {
                            float _337 = collision.contacts[0].point.x;
                            Vector3 _338 = this.myShineParticlesTransform.position;
                            _338.x = _337;
                            this.myShineParticlesTransform.position = _338;
                        }

                        {
                            float _339 = collision.contacts[0].point.y;
                            Vector3 _340 = this.myShineParticlesTransform.position;
                            _340.y = _339;
                            this.myShineParticlesTransform.position = _340;
                        }
                        this.myShineParticles.Simulate(0.005f, true);
                        this.myShineParticles.Play(true);
                        this.coinsN++;
                        this.coinsNfake++;
                        this.gamegod.ReportEvent(8, 0, 0);
                        if (this.coinDoubler)
                        {
                            this.coinsN++;
                            this.coinsNfake++;
                        }
                        this.UpdateCoinsGUI();
                    }
                    this.thisRigidbody = null;
                    this.thisGO = null;
                }
                else
                {
                    this.PlaySound(this.metalCrash, Random.Range(0.6f, 1.2f), 2);
                    if (this.shipDoesntShake)
                    {
                        if (collision.contacts[0].normal.y > 0)
                        {
                            this.spaceshipGo.y = this.spaceshipGo.y + 0.2f;
                            this.spaceshipGo.y = Mathf.Min(this.spaceshipGo.y, 1.3f);
                        }
                        else
                        {
                            this.spaceshipGo.y = this.spaceshipGo.y - 0.2f;
                            this.spaceshipGo.y = Mathf.Max(this.spaceshipGo.y, -1.3f);
                        }
                        return;
                    }
                    else
                    {
                        if (collision.contacts[0].normal.y > 0)
                        {
                            this.spaceshipGo.y = this.spaceshipGo.y + 0.7f;
                            this.spaceshipGo.y = Mathf.Min(this.spaceshipGo.y, 1.3f);
                        }
                        else
                        {
                            this.spaceshipGo.y = this.spaceshipGo.y - 0.7f;
                            this.spaceshipGo.y = Mathf.Max(this.spaceshipGo.y, -1.3f);
                        }
                    }
                }
                return;
                break;
            case 20://SpaceShip
                if (!this.spaceshipMode)
                {
                    this.myRigidbody.velocity = new Vector3(0, 0, 0);
                    this.DeactivatePower(this.currentPower);
                    this.DeactivateAllBoxPower();
                    this.myAnimation.GetComponent<Animation>().Play("Jump");
                    //Destroy(powerT.gameObject); currentPower=0;	
                    if (this.carryingChick)
                    {
                        this.thisSpaceChick.Hurt(this.myTransform.TransformDirection(new Vector3(-0.5f, 0.5f, 0)));
                        if (this.doubleChick && (this.doubleChickN == 1))
                        {
                            this.extraSpaceChick.Hurt(collision.contacts[0].normal);
                            this.doubleChickN = 0;
                        }
                        this.StartCoroutine(this.gamegod.CameraFocus(this.thisSpaceChick.myTransform, 15));
                        this.carryingChick = false;
                    }
                    this.touchingPlanet = false;
                    this.lowFuel = false;
                    this.spaceshipGo.y = 0;
                    this.thisGO.layer = 16;
                    this.thisGO.tag = this.myGO.tag;
                    this.spaceship = this.thisGO.transform;
                    this.jetpackOn = false;
                    // this.myJetPackFire.emit = false;
                    // this.myJetPackFireInstance.Stop();
                    this.runParticles.Stop();
                    this.thisSpaceship = (SpaceShip) this.spaceship.GetComponent("SpaceShip");
                    this.shipHandling = this.thisSpaceship.handlingg;
                    this.shipDoesntShake = this.thisSpaceship.doesntShake;
                    this.myTransform.position = this.spaceship.position;

                    {
                        float _341 = this.myZ;
                        Vector3 _342 = this.myTransform.position;
                        _342.z = _341;
                        this.myTransform.position = _342;
                    }
                    if (this.player2)
                    {
                        this.spaceshipGo = this.myTransform.position + new Vector3(1, 0, 0.05f);
                    }
                    else
                    {
                        this.spaceshipGo = this.myTransform.position + new Vector3(1, 0, 0);
                    }
                    this.myTransform.rotation = Quaternion.FromToRotation(Vector3.right, this.spaceship.TransformDirection(Vector3.up));
                    this.canDrive = false;
                    this.spaceship.parent = this.myTransform;
                    this.spaceship.position = this.myTransform.position;
                    this.spaceshipMode = true;
                    if (this.player2)
                    {
                        PayAndroid.isSpaceshipMode = true;
                        PayAndroid.Player2IsJumping = false;
                        PayAndroid.Player2jumpButton = 0;
                    }
                    this.coinSource.clip = this.coinSound;
                    this.coinSource2.clip = this.coinSound;
                    this.coinSource3.clip = this.coinSound;
                    this.coinSource4.clip = this.coinSound;
                    this.coinSource.volume = 0.4f;
                    this.coinSource2.volume = 0.4f;
                    this.coinSource3.volume = 0.4f;
                    this.coinSource4.volume = 0.4f;
                    this.coinSource2.pitch = 0.8f;
                    this.coinSource3.pitch = 1;
                    this.coinSource4.pitch = 0.8f;
                    this.StartCoroutine(this.PlaySpaceShipSound());
                    this.myRigidbody.isKinematic = true;
                    // 飞行状态下消失
                    this.gamegod.HideRentCarBtn();
                }
                this.thisGO = null;
                return;
                break;
            case 27://Heart
                CheatManager.Instance.ShowThreeHeartsBuyPage();
                this.thisTransform = this.thisGO.transform;
                this.thisGO.gameObject.SetActive(false);
                if (!this.spaceshipMode)
                {
                    if (!this.touchingPlanet)
                    {
                        this.myRigidbody.AddForce(-collision.contacts[0].normal * 10);
                    }
                }
                else
                {
                    this.myRigidbody.AddForce(-collision.contacts[0].normal * 5);
                }

                {
                    float _343 = this.thisTransform.position.x;
                    Vector3 _344 = this.myShineLoveParticlesTransform.position;
                    _344.x = _343;
                    this.myShineLoveParticlesTransform.position = _344;
                }

                {
                    float _345 = this.thisTransform.position.y;
                    Vector3 _346 = this.myShineLoveParticlesTransform.position;
                    _346.y = _345;
                    this.myShineLoveParticlesTransform.position = _346;
                }
                this.myShineLoveParticles.Simulate(0.005f, true);
                this.myShineLoveParticles.Play(true);
                this.PlayHeartSound();
                this.heartsN++;
                this.UpdateHeartsGUI();
                this.thisGO = null;
                if (!this.touchingPlanet)
                {
                    this.myRigidbody.velocity = this.myLastVelocity;
                }
                return;
                break;
            case 21://Coin (EXISTEM DUAS)
                if (!this.spaceshipMode)
                {
                    if (!this.touchingPlanet && (this.currentPower != this.magnet))
                    {
                        this.myRigidbody.AddForce(-collision.contacts[0].normal * 2);
                    }
                }
                else
                {
                    this.myRigidbody.AddForce(-collision.contacts[0].normal * 5);
                }
                this.PlayCoinSound();

                {
                    float _347 = collision.contacts[0].point.x;
                    Vector3 _348 = this.myShineParticlesTransform.position;
                    _348.x = _347;
                    this.myShineParticlesTransform.position = _348;
                }

                {
                    float _349 = collision.contacts[0].point.y;
                    Vector3 _350 = this.myShineParticlesTransform.position;
                    _350.y = _349;
                    this.myShineParticlesTransform.position = _350;
                }
                this.myShineParticles.Simulate(0.005f, true);
                this.myShineParticles.Play(true);
                this.coinsN++;
                this.coinsNfake++;
                if (this.coinDoubler)
                {
                    this.coinsN++;
                    this.coinsNfake++;
                }
                this.UpdateCoinsGUI();
                this.thisGO = null;
                return;
                break;
            case 13://Coin (EXISTEM DUAS)
                if (!this.spaceshipMode)
                {
                    if (!this.touchingPlanet && (this.currentPower != this.magnet))
                    {
                        this.myRigidbody.AddForce(-collision.contacts[0].normal * 2);
                    }
                }
                else
                {
                    this.myRigidbody.AddForce(-collision.contacts[0].normal * 5);
                }
                this.PlayCoinSound();

                {
                    float _351 = collision.contacts[0].point.x;
                    Vector3 _352 = this.myShineParticlesTransform.position;
                    _352.x = _351;
                    this.myShineParticlesTransform.position = _352;
                }

                {
                    float _353 = collision.contacts[0].point.y;
                    Vector3 _354 = this.myShineParticlesTransform.position;
                    _354.y = _353;
                    this.myShineParticlesTransform.position = _354;
                }
                this.myShineParticles.Simulate(0.005f, true);
                this.myShineParticles.Play(true);
                this.coinsN++;
                this.coinsNfake++;
                this.coinsN++;
                this.coinsNfake++;
                this.UpdateCoinsGUI();
                this.thisGO = null;
                return;
                break;
            case 16://Player
                if (this.spaceshipMode)
                {
                    if (!this.player2)
                    {
                        this.PlaySound(this.metalCrash, Random.Range(0.8f, 1.8f), 2);
                    }
                    if (collision.contacts[0].normal.y > 0)
                    {
                        this.spaceshipGo.y = this.spaceshipGo.y + 0.7f;
                        this.spaceshipGo.y = Mathf.Min(this.spaceshipGo.y, 1.3f);
                    }
                    else
                    {
                        this.spaceshipGo.y = this.spaceshipGo.y - 0.7f;
                        this.spaceshipGo.y = Mathf.Max(this.spaceshipGo.y, -1.3f);
                    }
                }
                //myRigidbody.AddForce(collision.contacts[0].normal);
                this.thisGO = null;
                return;
                break;
            case 24://SpaceChick
                if (this.stillNeedsTime)
                {
                    return;
                }
                if (!this.myRigidbody.isKinematic)
                {
                    this.myRigidbody.velocity = this.myLastVelocity;
                }
                if (!this.carryingChick)
                {
                    this.thisSpaceChick = (SpaceChick) this.thisGO.GetComponent("SpaceChick");
                    if (!this.thisSpaceChick.safe)
                    {
                        if (this.player2)
                        {
                            this.carryingChick = this.thisSpaceChick.Hold(this.myTransform, this.myTransform.rotation, 2);
                            if (this.currentPower == this.chickHammer)
                            {
                                this.myPower.GetComponent<Animation>().Stop();
                                this.myPower.gameObject.SetActive(true);
                                this.fakeHammer.gameObject.SetActive(false);
                                this.godMode = true;
                            }
                            else
                            {
                                if (this.currentPower == this.stealth)
                                {
                                    this.gamegod.Stealthp2(false);
                                    this.godMode = false;
                                }
                            }
                        }
                        else
                        {
                            //PlayChickSound();
                            this.carryingChick = this.thisSpaceChick.Hold(this.myTransform, this.myTransform.rotation, 1);
                            if (this.currentPower == this.chickHammer)
                            {
                                this.myPower.gameObject.SetActive(true);
                                this.fakeHammer.gameObject.SetActive(false);
                                this.myPower.GetComponent<Animation>().Stop();
                                this.godMode = true;
                            }
                            else
                            {
                                if (this.currentPower == this.stealth)
                                {
                                    this.gamegod.Stealthp1(false);
                                    this.godMode = false;
                                }
                            }
                        }
                    }
                }
                else
                {
                    //PlayChickSound();
                    if (this.doubleChick && (this.doubleChickN == 0))
                    {
                        this.extraSpaceChick = (SpaceChick) this.thisGO.GetComponent("SpaceChick");
                        this.DoubleChick();
                        return;
                    }
                    if (this.menuVersion)
                    {
                        this.PlayHeartSound2();
                    }
                    this.otherSpaceChick = this.thisSpaceChick;
                    this.thisSpaceChick = (SpaceChick) this.thisGO.GetComponent("SpaceChick");
                    if (!this.thisSpaceChick.safe)
                    {
                        if (this.thisSpaceChick.imConfused)
                        {
                            this.thisSpaceChick = this.otherSpaceChick;
                            return;
                        }
                        this.otherSpaceChick.Hurt(this.myTransform.TransformDirection(Vector3.up));
                        if (this.currentPower == this.boomJetpack)
                        {
                            this.StartCoroutine(this.WeNeedTime());
                        }
                        if (this.player2)
                        {
                            if (this.currentPower == this.chickHammer)
                            {
                                this.myPower.GetComponent<Animation>().Stop();
                                this.myPower.gameObject.SetActive(true);
                                this.fakeHammer.gameObject.SetActive(false);
                                this.godMode = true;
                            }
                            else
                            {
                                if (this.currentPower == this.stealth)
                                {
                                    this.gamegod.Stealthp2(false);
                                    this.godMode = false;
                                }
                            }
                            this.carryingChick = this.thisSpaceChick.Hold(this.myTransform, this.myTransform.rotation, 2);
                            this.gamegod.ReportEvent(10, 0, 0);
                        }
                        else
                        {
                            //PlayChickSound();
                            if (this.currentPower == this.chickHammer)
                            {
                                this.myPower.GetComponent<Animation>().Stop();
                                this.myPower.gameObject.SetActive(true);
                                this.fakeHammer.gameObject.SetActive(false);
                                this.godMode = true;
                            }
                            else
                            {
                                if (this.currentPower == this.stealth)
                                {
                                    this.gamegod.Stealthp1(false);
                                    this.godMode = false;
                                }
                            }
                            this.carryingChick = this.thisSpaceChick.Hold(this.myTransform, this.myTransform.rotation, 1);
                            this.gamegod.ReportEvent(10, 0, 0);
                        }
                        //PlayChickSound();
                        this.otherSpaceChick = null;
                    }
                    else
                    {
                        this.thisSpaceChick = this.otherSpaceChick;
                        this.otherSpaceChick = null;
                    }
                }
                this.thisGO = null;
                return;
                break;
            case 25://Enemy
                if (!this.blinking) //不是无敌状态
                {
                    if (!this.spaceshipMode)
                    {
                        if ((!this.godMode && !this.superGodMode) && !this.inStore)
                        {
                            this.Hurt();
                            this.LoseCoins();
                            if (this.carryingChick)
                            {
                                this.thisSpaceChick.Hurt(collision.contacts[0].normal);
                                if (this.doubleChick && (this.doubleChickN == 1))
                                {
                                    this.extraSpaceChick.Hurt(collision.contacts[0].normal);
                                    this.doubleChickN = 0;
                                }
                                this.carryingChick = false;
                                if (this.currentPower == this.chickHammer)
                                {
                                    this.myPower.gameObject.SetActive(false);
                                    this.fakeHammer.gameObject.SetActive(true);
                                    this.godMode = false;
                                }
                                else
                                {
                                    if (this.currentPower == this.stealth)
                                    {
                                        if (this.player2)
                                        {
                                            this.gamegod.Stealthp2(true);
                                            this.godMode = true;
                                        }
                                        else
                                        {
                                            this.gamegod.Stealthp1(true);
                                            this.godMode = true;
                                        }
                                    }
                                }
                            }
                            if (this.currentPower == this.magnet)
                            {
                                this.myPower.gameObject.SetActive(false);
                            }
                        }
                        else
                        {
                            if (this.currentPower == this.chickHammer)
                            {
                                this.myPower.GetComponent<Animation>().Play();
                            }
                        }
                    }
                }
                this.thisGO = null;
                return;
                break;
            case 26://Bad Explosion
                if (!this.blinking)
                {
                    if ((!this.spaceshipMode && !this.superGodMode) && !this.inStore)
                    {
                        this.Hurt();
                        this.LoseCoins();
                        if (this.carryingChick)
                        {
                            this.thisSpaceChick.Hurt(collision.contacts[0].normal);
                            if (this.doubleChick && (this.doubleChickN == 1))
                            {
                                this.extraSpaceChick.Hurt(collision.contacts[0].normal);
                                this.doubleChickN = 0;
                            }
                            this.carryingChick = false;
                            if (this.currentPower == this.chickHammer)
                            {
                                this.myPower.gameObject.SetActive(false);
                                this.fakeHammer.gameObject.SetActive(true);
                                this.godMode = false;
                            }
                        }
                        if (this.currentPower == this.magnet)
                        {
                            this.myPower.gameObject.SetActive(false);
                        }
                        else
                        {
                            if (this.currentPower == this.stealth)
                            {
                                if (this.player2)
                                {
                                    this.gamegod.Stealthp2(true);
                                    this.godMode = true;
                                }
                                else
                                {
                                    this.gamegod.Stealthp1(true);
                                    this.godMode = true;
                                }
                            }
                        }
                    }
                    else
                    {
                        if (collision.contacts[0].normal.y > 0)
                        {
                            this.spaceshipGo.y = this.spaceshipGo.y + 2;
                            this.spaceshipGo.y = Mathf.Min(this.spaceshipGo.y, 1.3f);
                        }
                        else
                        {
                            this.spaceshipGo.y = this.spaceshipGo.y - 2;
                            this.spaceshipGo.y = Mathf.Max(this.spaceshipGo.y, -1.3f);
                        }
                        this.Hurt();
                        this.LoseCoins();
                    }
                }
                this.thisGO = null;
                return;
                break;
            case 14: //Projectile
                /*if(!blinking){
				if(!spaceshipMode){
					Hurt();
					LoseCoins();
					if(carryingChick){ thisSpaceChick.Hurt(collision.contacts[0].normal); carryingChick=false; }
				}
			}*/
                this.myRigidbody.velocity = new Vector3(0, 0, 0);
                this.thisGO = null;
                return;
                break;
            case 10://Space Chick Planet
                if (!this.spaceshipMode)
                {
                    this.gamegod.InformDirection(this.myLastVelocity.x);
                    if (this.carryingChick)
                    {
                        this.thisSpaceChick.Save(-collision.contacts[0].normal);
                        this.StartCoroutine(this.WeNeedTime());
                        if (this.doubleChick && (this.doubleChickN > 0))
                        {
                            this.extraSpaceChick.Save(-collision.contacts[0].normal);
                            this.doubleChickN = 0;
                        }
                        this.carryingChick = false;
                        this.StartCoroutine(this.gamegod.CameraFocus(this.thisGO.transform, 6));
                        if (this.currentPower == this.chickHammer)
                        {
                            this.myPower.gameObject.SetActive(false);
                            this.fakeHammer.gameObject.SetActive(true);
                            this.godMode = false;
                        }
                        else
                        {
                            if (this.currentPower == this.stealth)
                            {
                                if (this.player2)
                                {
                                    this.gamegod.Stealthp2(true);
                                    this.godMode = true;
                                }
                                else
                                {
                                    this.gamegod.Stealthp1(true);
                                    this.godMode = true;
                                }
                            }
                        }
                    }
                    if (!this.touchingPlanet || this.physicsObject)
                    {
                        this.physicsObject = false;
                        this.lastPlanet = collision.transform;
                        this.currentPlanet = this.thisGO.GetComponent<Rigidbody>();
                        this.myAnimation.GetComponent<Animation>().Stop();
                        this.myAnimation.GetComponent<Animation>().Play("Jump2");
                        this.animState = this.myAnimation.GetComponent<Animation>().PlayQueued("run");
                        this.animState.speed = 1.6f;
                        this.animState = null;
                        //myAnimation.animation.Play("run");
                        this.touchingPlanet = true;
                        this.superGravity = false;
                        if (this.currentPower == this.hook)
                        {
                            this.hookGO.TurnOn();
                        }
                        if (this.shouldArrow)
                        {
                            this.tutArrowR.enabled = true;
                        }
                        this.gamegod.ReportEvent(7, (int) (1.5f * (Time.realtimeSinceStartup - this.offAir)), 0);
                        if (this.player2)
                        {
                            if (PayAndroid.Player2IsJumping)
                            {
                                PayAndroid.Player2jumpButton = 0;
                            }
                            PayAndroid.Player2IsJumping = false;
                        }
                        this.JetPack(false);
                        this.asteroid = false;
                        this.runParticles.Play();
                        //planetNormal=myPlanet.position-myTransform.position;
                        this.planetNormal = -collision.contacts[0].normal;
                        if (!Physics.Raycast(this.myTransform.position, this.planetNormal, this.myHeight, 1 << 10))
                        {
                            this.planetNormal = -this.planetNormal;
                        }
                        /*if (Physics.Raycast (myTransform.position, myPlanet.position-myTransform.position, hit,1, 1<<18)) {
					//planetNormal=-hit.normal;
					planetNormal=myPlanet.position-myTransform.position;
				}
				else{
					//planetNormal=-collision.contacts[0].normal;
					planetNormal=myPlanet.position-myTransform.position;
				}
				planetNormal=-collision.contacts[0].normal;
				*/
                        this.jumped = false;
                        this.myTransform.rotation = Quaternion.Lerp(this.myTransform.rotation, Quaternion.FromToRotation(Vector3.down, new Vector3(this.planetNormal.x, this.planetNormal.y, 0)), 0.2f);
                        this.runDirection = Vector3.right;
                        this.myRigidbody.velocity = new Vector3(0, 0, 0);
                        this.myPlanet = null;
                        this.thisGO = null;
                        return;
                    }
                }
                else
                {
                    if (this.thisGO.name == "a")
                    {
                        this.asteroid = true;
                    }
                    else
                    {
                        this.asteroid = false;
                    }
                    if (!this.asteroid)
                    {
                        this.DeactivateSpaceShipMode(collision.transform, -collision.contacts[0].normal, collision.contacts[0].point);
                    }
                    this.thisGO = null;
                    return;
                }
                this.thisGO = null;
                return;
                break;
        }
        collision = null;
    }

    public virtual void DoubleChick()
    {
        if (!this.extraSpaceChick.safe)
        {
            if (this.extraSpaceChick.Hold(this.myTransform, this.myTransform.rotation, 1, 2.5f))
            {
                this.doubleChickN++;
            }
        }
    }

    public virtual IEnumerator WeNeedTime()
    {
        this.stillNeedsTime = true;
        float timeWeNeed = Time.time;
        while ((Time.time - timeWeNeed) < 1)
        {
            yield return null;
        }
        this.stillNeedsTime = false;
    }

    public virtual void OneMoreChick()
    {
        this.chicksN++;
        this.UpdateChicksGUI();
        if (this.goldDigger)
        {
            this.coinsN = this.coinsN + 150;
            this.coinsNfake = this.coinsNfake + 150;
            this.UpdateCoinsGUI();
            this.PlayCoinSound();
        }
        if (this.chicks4life && ((this.chicksN % 3) == 0))
        {
            this.PlayHeartSound();
            this.heartsN++;
            this.UpdateHeartsGUI();
        }
    }

    public virtual void BloodMoney()
    {
        this.coinsN = this.coinsN + 100;
        this.coinsNfake = this.coinsNfake + 100;
        this.UpdateCoinsGUI();
        this.PlayCoinSound();
    }

    public virtual void LoseCoins()
    {
        if (this.coinsN <= 0)
        {
            this.UpdateCoinsGUI();
            return;
        }
        if (this.lostCoins[0].InsertCoin(this.myTransform.position, this.myTransform.TransformDirection(new Vector3(-1, 0.3f, 0))))
        {
            this.coinsN--;
        }
        if (this.coinsN <= 0)
        {
            this.UpdateCoinsGUI();
            return;
        }
        if (this.lostCoins[1].InsertCoin(this.myTransform.position, this.myTransform.TransformDirection(new Vector3(-0.3f, 1, 0))))
        {
            this.coinsN--;
        }
        if (this.coinsN <= 0)
        {
            this.UpdateCoinsGUI();
            return;
        }
        if (this.lostCoins[2].InsertCoin(this.myTransform.position, this.myTransform.TransformDirection(new Vector3(0, 1, 0))))
        {
            this.coinsN--;
        }
        if (this.coinsN <= 0)
        {
            this.UpdateCoinsGUI();
            return;
        }
        if (this.lostCoins[3].InsertCoin(this.myTransform.position, this.myTransform.TransformDirection(new Vector3(0.3f, 1, 0))))
        {
            this.coinsN--;
        }
        if (this.coinsN <= 0)
        {
            this.UpdateCoinsGUI();
            return;
        }
        if (this.lostCoins[4].InsertCoin(this.myTransform.position, this.myTransform.TransformDirection(new Vector3(1, 0.3f, 0))))
        {
            this.coinsN--;
        }
        this.UpdateCoinsGUI();
    }

    public virtual void DieNow()
    {
        this.heartsN = 1;
        EncryptedPlayerPrefs.SetInt("currentMission_Obj1_complete", 1);
        EncryptedPlayerPrefs.SetInt("currentMission_Obj2_complete", 1);
        EncryptedPlayerPrefs.SetInt("currentMission_Obj3_complete", 1);
        EncryptedPlayerPrefs.SetInt("currentMission_Obj4_complete", 1);
        //chicksN=50;
        this.Hurt();
    }

    public virtual void Hurt()
    {
        if (this.superGodMode)
        {
            return;
        }
        this.heartsN--;
        if (this.heartsN < 0)
        {
            return;
        }
        //gamegod.SaveProgress2();
        this.UpdateHeartsGUI();
        this.PlayHurtSound();
        this.runParticles.Stop();
        if (!this.spaceshipMode)
        {
            this.myAnimation.GetComponent<Animation>().Stop();
            this.myAnimation.GetComponent<Animation>().Play("Hurt");
        }
        this.jumpCounter = 0;
        this.myRigidbody.AddForce(this.myTransform.TransformDirection(Vector3.up) * 30);
        this.touchingPlanet = false;
        if (this.heartsN > 0)
        {
            this.StartCoroutine(this.Blink());
            //
            //gamegod.trigger("绝不松手",4);
            //gamegod.trigger("好心有好报",5);
            if (!this.spaceshipMode && !this.isPlayer1UseCar())
            {
                this.gamegod.ShowRCGuide();
            }
        }
        else
        {
            if (this.spaceshipMode)
            {
                this.spriteOn = false;
                this.spaceshipGo.y = this.myTransform.position.y + 1;

                {
                    float _355 = this.myTransform.position.x;
                    Vector3 _356 = this.explosionT.position;
                    _356.x = _355;
                    this.explosionT.position = _356;
                }

                {
                    float _357 = this.myTransform.position.y;
                    Vector3 _358 = this.explosionT.position;
                    _358.y = _357;
                    this.explosionT.position = _358;
                }
                this.myCollider.enabled = false;
                //fire.position.z=spaceship.position.z+0.1;
                //fire.parent=myTransform;
                this.shipHit = true;
                this.explosion.GetComponent<Animation>().Play();
                this.myCollider.enabled = false;
                this.fireSmoke.playbackSpeed = 2;
                //fireSmoke.Play();
                //fire1.Stop();
                //fire2.Stop();
                EventsManager.LogEventWithParams("Deaths", ((((((("{\"Section\" : " + this.gamegod.sectionNumber) + ", \"Difficulty\" : ") + this.gamegod.numberOfSections) + ", \"Position\" : ") + this.myTransform.position.x) + ", \"SpaceShipMode\" : \"") + this.spaceshipMode) + "\" }");
                this.StartCoroutine(this.gamegod.KillCam());
                this.gamegod.DeactivateSpaceShipMode();
                //fire1.playbackSpeed=2;
                //fire1.Play();
                //fire2.playbackSpeed=2;
                //fire2.Play();
                this.gamegod.ReportEvent(888, 3, 0);
                this.thisSpaceship.BlowUp();
            }
            else
            {
                Time.timeScale = 0.5f;
                this.StartCoroutine(this.TimeSpeedUp());
                this.DeactivatePower(this.currentPower);
                this.DeactivateAllBoxPower();
                if (this.gamegod.numberOfSections < 2)
                {
                    this.gamegod.ReportEvent(999, 1, 0);
                }
                this.deathPos = this.myTransform.position;
                this.deathVel = this.myRigidbody.velocity;
                EventsManager.LogEventWithParams("Deaths", ((((((((("{\"Section\" : " + this.gamegod.sectionNumber) + ", \"Difficulty\" : ") + this.gamegod.numberOfSections) + ", \"Position\" : ") + this.myTransform.position.x) + ", \"SpaceShipMode\" : \"") + this.spaceshipMode) + "\", \"NumberOfCoins\" : ") + this.coinsN) + " }");
                this.StartCoroutine(this.gamegod.KillCam());
                this.myRigidbody.AddForce(this.myTransform.TransformDirection(Vector3.up) * 10);
                //myRigidbody.useGravity=true;
                this.myCollider.enabled = false;
                this.dead = true;
                this.trailRenderer.enabled = false;
                this.runParticles.Stop();
            }
        }
    }

    public virtual void DynamicDirection(float f)
    {
        this.planetNormal = this.planetNormal * f;
        if (this.planetNormal.x > 0)
        {
            if (this.planetNormal.y > 0)
            {

                {
                    float _359 = this.artSize;
                    Vector3 _360 = this.myArt.localScale;
                    _360.x = _359;
                    this.myArt.localScale = _360;
                }
                this.inverted = false;
            }
            else
            {

                {
                    float _361 = -this.artSize;
                    Vector3 _362 = this.myArt.localScale;
                    _362.x = _361;
                    this.myArt.localScale = _362;
                }
                this.inverted = true;
            }
        }
        else
        {
            if (this.planetNormal.y > 0)
            {

                {
                    float _363 = -this.artSize;
                    Vector3 _364 = this.myArt.localScale;
                    _364.x = _363;
                    this.myArt.localScale = _364;
                }
                this.inverted = true;
            }
            else
            {

                {
                    float _365 = this.artSize;
                    Vector3 _366 = this.myArt.localScale;
                    _366.x = _365;
                    this.myArt.localScale = _366;
                }
                this.inverted = false;
            }
        }
    }

    public virtual IEnumerator TimeSpeedUp()
    {
        while (Time.timeScale < 2)
        {
            Time.timeScale = Time.timeScale + 0.03f;
            yield return null;
        }
        Time.timeScale = 2;
    }

    public virtual IEnumerator Blink()
    {
        this.blinkTimer = 0;
        if (!this.spaceshipMode)
        {
            if (this.secChance)
            {
                this.myGO.layer = 31;
            }
            else
            {
                this.myGO.layer = 23;
            }
        }
        this.idCollider.enabled = false;
        this.blinking = true;
        this.blinkCounter = 0.1f;
        while (this.blinkTimer < 6) //控制闪烁
        {
            this.blinkTimer = this.blinkTimer + Time.deltaTime;
            if (this.blinkTimer > this.blinkCounter)
            {
                if (this.blinkTimer < 4)
                {
                    this.blinkCounter = this.blinkTimer + 0.2f;
                }
                else
                {
                    this.blinkCounter = this.blinkTimer + 0.1f;
                }
                if (this.spriteOn)
                {
                    this.spriteOn = false;
                }
                else
                {
                    this.spriteOn = true;
                }
            }
            yield return null;
        }
        this.blinking = false;
        this.idCollider.enabled = true;
        this.spriteOn = true;
        this.myGO.layer = 16;
        if (this.currentPower == this.magnet)
        {
            this.myPower.gameObject.SetActive(true);
        }
    }

    //结束飞船模式
    public virtual void DeactivateSpaceShipMode(Transform t, Vector3 normalV, Vector3 pointV)
    {
        this.touchingPlanet = true;

        {
            float _367 = this.spaceship.position.z + 1;
            Vector3 _368 = this.spaceship.position;
            _368.z = _367;
            this.spaceship.position = _368;
        }
        this.trailRenderer.enabled = true;
        this.offAir = Time.realtimeSinceStartup;
        this.spaceship.parent = t;
        this.spaceship.gameObject.GetComponent<Collider>().enabled = false;

        {
            float _369 = //制造火焰
            pointV.x;
            Vector3 _370 = this.fire.position;
            _370.x = _369;
            this.fire.position = _370;
        }

        {
            float _371 = pointV.y;
            Vector3 _372 = this.fire.position;
            _372.y = _371;
            this.fire.position = _372;
        }

        {
            float _373 = this.spaceship.position.z + 0.1f;
            Vector3 _374 = this.fire.position;
            _374.z = _373;
            this.fire.position = _374;
        }
        this.fire.position = this.fire.position + (normalV * 0.1f);

        {
            float _375 = //爆炸
            this.fire.position.x;
            Vector3 _376 = this.explosionT.position;
            _376.x = _375;
            this.explosionT.position = _376;
        }

        {
            float _377 = this.fire.position.y;
            Vector3 _378 = this.explosionT.position;
            _378.y = _377;
            this.explosionT.position = _378;
        }
        this.explosion.GetComponent<Animation>().Play();
        this.fireSmoke.Play();
        this.fire1.Play();
        this.fire2.Play();
        this.spaceship.position = this.spaceship.position + (normalV * 0.2f);
        this.myTransform.position = this.myTransform.position - (normalV * 0.3f);

        {
            float _379 = this.spaceship.position.y - 0.1f;
            Vector3 _380 = this.fire.position;
            _380.y = _379;
            this.fire.position = _380;
        }
        this.fire.parent = this.spaceship;
        //spaceship.gameObject.animation.Stop();
        this.spaceshipMode = false;
        this.spaceshipCanFly = false;
        if (this.player2)
        {
            PayAndroid.isSpaceshipMode = false;
            PayAndroid.Player2jumpButton = 0;
            PayAndroid.Player2IsJumping = false;
        }
        this.gamegod.isShowDoubleJumped = false;
        this.gamegod.DeactivateSpaceShipMode();
        this.thisSpaceship.BlowUp();
        this.gamegod.ShowRentCarBtn();
        //新手使用问题
        if (GobalData.Instance.finishFEG())
        {
            this.gamegod.XszyTrigger(3); //引导租车
        }
        if (!this.gamegod.needTutorialSkill)
        {
            this.gamegod.XszyTrigger(4); // show guide 4
        }
        CheatManager.Instance.ShowPageAfterDestroyShip();
        CheatManager.Instance.HasShowShipPage = false; //每次金币关卡只显示一次购买飞船界面
    }

    public virtual float SNFloatLerp(float from, float to, float howMuch)
    {
        if (howMuch < 0f)
        {
            return from;
        }
        else
        {
            if (howMuch > 1f)
            {
                return to;
            }
            else
            {
                return ((to - from) * howMuch) + from;
            }
        }
    }

    /*function VectorForThisTurn(i:int):Vector3{ 
	switch(i){
		case 0:
			return(Vector3(0,-1,0)); 
		break;
		case 1: 
			return(Vector3(-1,-1,0)); 
		break;	
		case 2: 
			return(Vector3(-1,0,0)); 
		break;	
		case 3: 
			return(Vector3(-1,1,0)); 
		break;	
		case 4:
			return(Vector3(0,1,0));  
		break;	
		case 5: 
			return(Vector3(1,1,0)); 
		break;	
		case 6: 
			return(Vector3(1,0,0)); 
		break;	
		case 7: 
			return(Vector3(1,-1,0)); 
		break;
		case 8:
			return(Vector3(0.5,-1,0)); 
		break;
		case 9: 
			return(Vector3(-0.5,-1,0)); 
		break;	
		case 10: 
			return(Vector3(-1,-0.5,0)); 
		break;	
		case 11: 
			return(Vector3(-1,0.5,0)); 
		break;	
		case 12:
			return(Vector3(-0.5,1,0));  
		break;	
		case 13: 
			return(Vector3(0.5,1,0)); 
		break;	
		case 14: 
			return(Vector3(1,0.5,0)); 
		break;	
		case 15: 
			return(Vector3(1,-0.5,0)); 
		break;	
		
	}	
}*/
    public virtual void CoinPicked()
    {
        // myShineParticlesTransform.position.x=myTransform.position.x;
        // myShineParticlesTransform.position.y=myTransform.position.y;
        // myShineParticles.Simulate(0.005f, true);
        // myShineParticles.Play(true);
        this.PlayCoinSound2();
        if (this.spaceshipMode)
        {
            this.coinsFloat = this.coinsFloat - Mathf.Floor(this.coinsFloat);
            this.coinCounterish = this.coinsFloat + 0.6f;
            this.coinsN = (int) Mathf.Round(this.coinsN + this.coinCounterish);
            this.coinsNfake = (int) Mathf.Round(this.coinsNfake + this.coinCounterish);
            this.coinsFloat = this.coinsFloat + 0.6f;
            if (this.coinDoubler)
            {
                this.coinsN = (int) Mathf.Round(this.coinsN + this.coinCounterish);
                this.coinsNfake = (int) Mathf.Round(this.coinsNfake + this.coinCounterish);
            }
        }
        else
        {
            this.coinsN++;
            this.coinsNfake++;
            if (this.coinDoubler)
            {
                this.coinsN++;
                this.coinsNfake++;
            }
        }
        this.UpdateCoinsGUI();
    }

    public virtual void UpdateHeartsGUI()
    {
        this.thisString = "" + this.heartsN;
        this.hearts.text = this.thisString;
    }

    public virtual void UpdateCoinsGUI()
    {
        this.thisString = "" + this.coinsN;
        if (this.thisString.Length == 1)
        {
            this.thisString = "0" + this.thisString;
        }
        this.coins.text = this.thisString;
    }

    public virtual void UpdateChicksGUI()
    {
        this.thisString = "" + this.chicksN;
        if (this.thisString.Length == 1)
        {
            this.thisString = "0" + this.thisString;
        }
        this.chicks.text = this.thisString;
    }

    public virtual void CenterInCamera(Vector3 v)//trailRenderer.enabled=true;
    {
        if (this.spaceshipMode)
        {
            return;
        }
        //	heartsN--;
        //	if(heartsN<0){return;}
        //	//gamegod.SaveProgress2();
        //	UpdateHeartsGUI();
        //	PlayHurtSound();
        //	runParticles.Stop();
        //	if(!spaceshipMode){
        //		myAnimation.animation.Stop();
        //		myAnimation.animation.Play("Hurt");
        //	}
        //	jumpCounter=0;
        //	myRigidbody.AddForce(myTransform.TransformDirection(Vector3.up)*30);
        //	touchingPlanet=false;
        //	if(heartsN>0) {
        //	
        //	}else{
        //		myCollider.enabled=false;
        //			dead=true;
        //			trailRenderer.enabled=false;
        //			runParticles.Stop();
        //			return;	
        //	}
        this.Hurt();
        if (this.heartsN <= 0)
        {
            return;
        }
        this.runParticles.Stop();
        this.touchingPlanet = false;
        this.trailRenderer.enabled = false;
        this.myTransform.position = v;

        {
            float _381 = 2.5f;
            Vector3 _382 = this.myTransform.position;
            _382.y = _381;
            this.myTransform.position = _382;
        }
        this.myTransform.rotation = this.initialRot;
        this.StartCoroutine(this.Blink());
    }

    public virtual void SmokeParticlesTurnOff()
    {
        this.smokePcounter = 0;
        //mySmokeP.Simulate(0);
        this.StartCoroutine(this.SmokeParticlesTurnOff(true));
    }

    public virtual IEnumerator SmokeParticlesTurnOff(bool t)//mySmokeP.emit=false;
    {
        while (this.smokePcounter < 1.3f)
        {
            this.smokePcounter = this.smokePcounter + Time.deltaTime;
            yield return null;
        }
    }

    public virtual Vector3 PhysicsHere()
    {
        this.planetCounter = 0;
        this.thisForce = new Vector3(0, 0, 0);
        Vector3 lastPlayerPosition = this.myTransform.position;
        float thisX = 0;
        Transform thisPlanet = null;
        /*if(jetpackOn){
		thisVector=Vector3(0,-myTransform.position.y,0);
		thisX=1;
		if(thisVector.y>thisX){thisVector.y=thisX;}
		else if(thisVector.y<-thisX){thisVector.y=-thisX;}
		thisForce=thisVector;	
		return(thisForce);
	}*/
        while (this.planetCounter < this.myPlanetoids.Length) //Para Cada Planeta
        {
            this.thisPlanetoid = this.myPlanetoids[this.planetCounter];
            if (!this.thisPlanetoid.blackHole)
            {
                thisPlanet = this.thisPlanetoid.myTransform; //Agarra o transform dele
                if (this.myXs[this.planetCounter] == -1000)
                {
                    thisX = thisPlanet.position.x; //Se for -1000 é porque é asteroide
                }
                else
                {
                    thisX = this.myXs[this.planetCounter]; //Senão é planeta
                }
                if (this.MathAbs(thisX - this.SNFloatLerp(lastPlayerPosition.x, this.whereTo.x, 0.5f)) <= 1) //Se a distancia em X ao Player for menor que X
                {
                    this.thisVector = this.Subtract2d(thisPlanet.position, lastPlayerPosition); //Calcula o Vector que vai do player ao planeta
                    this.thisVector = this.EvaluatePlanet(this.thisVector, this.myLastVelocity, this.xBigger, 0.8f, 1.1f); //Avaliação dos planetas
                    this.thisForce = this.thisForce + ((this.thisVector / this.SqrMagnitude2d(this.thisVector)) * this.thisPlanetoid.myMass); //Calcula e adiciona força
                }
            }
            else
            {
                if (!this.blinking)
                {
                    thisX = this.myXs[this.planetCounter];
                    if (this.MathAbs(thisX - this.SNFloatLerp(lastPlayerPosition.x, this.whereTo.x, 0.5f)) <= 1)
                    {
                        thisPlanet = this.thisPlanetoid.myTransform;
                        this.thisVector = this.Subtract2d(thisPlanet.position, lastPlayerPosition);
                        if (this.thisVector.sqrMagnitude > (0.4f * 0.4f))
                        {
                            this.thisForce = this.thisForce + ((this.thisVector / this.SqrMagnitude2d(this.thisVector)) * 1.5f);
                        }
                        else
                        {
                            this.thisForce = this.thisForce + ((this.thisVector / this.SqrMagnitude2d(this.thisVector)) * 0.7f);
                        }
                    }
                }
            }
            this.planetCounter++;
        }
        if (this.nearestPick < this.planetPickMin)
        {
            this.thisVector = this.Subtract2d(thisPlanet.position, lastPlayerPosition);
            this.thisForce = this.thisForce + (((this.thisVector / this.SqrMagnitude2d(this.thisVector)) / this.SqrMagnitude2d(this.thisVector)) * 0.6f);
        }
        //if(Mathf.Abs(lastPlayerPosition.y)>jumpLine){
        this.thisVector = new Vector3(0, this.jumpLine - lastPlayerPosition.y, 0);
        thisX = 0.3f;
        if (this.thisVector.y > thisX)
        {
            this.thisVector.y = thisX;
        }
        else
        {
            if (this.thisVector.y < -thisX)
            {
                this.thisVector.y = -thisX;
            }
        }
        this.thisForce = this.thisForce + (this.thisVector * 0.8f);
        //}
        /*if(thisForce.y>2.5){thisForce.y=2.5;}
	else if(thisForce.y<-2.5){thisForce.y=-2.5;}
	if(thisForce.x>2.5){thisForce.x=2.5;}
	else if(thisForce.x<-2.5){thisForce.x=-2.5;}*/
        if (lastPlayerPosition.x < this.leftMost)
        {
            this.thisForce = this.thisForce + new Vector3(this.leftMost - lastPlayerPosition.x, 0, 0);
        }
        else
        {
            if (lastPlayerPosition.x > this.rightMost)
            {
                this.thisForce = this.thisForce + new Vector3(this.rightMost - lastPlayerPosition.x, 0, 0);
            }
        }
        return this.thisForce * 1.4f;
    }

    public virtual void RecalculateNearestPlanet()
    {
        this.planetCounter = 0;
        this.planetPickMin = 10;
        this.nearestPick = this.planetPickMin;
        this.thisForce = new Vector3(0, 0, 0);
        this.myLastVelocity = this.myRigidbody.velocity;
        Vector3 lastPlayerPosition = this.myTransform.position;
        float thisX = 0;
        this.whereTo = lastPlayerPosition + (this.myLastVelocity * 0.6f);
        while (this.planetCounter < this.myPlanetoids.Length)
        {
            this.planetCandidate = this.myPlanetoids[this.planetCounter].myTransform;
            if (this.myXs[this.planetCounter] == -1000)
            {
                thisX = this.planetCandidate.position.x;
            }
            else
            {
                thisX = this.myXs[this.planetCounter];
            }
            if (this.MathAbs(thisX - this.myTransform.position.x) <= 1)
            {
                this.planetPicker = this.Subtract2d(this.planetCandidate.position, this.whereTo);
                this.thisMag = this.SqrMagnitude2d(this.planetPicker);
                if (((this.myLastVelocity.x > 0) && (this.planetPicker.x > 0)) || ((this.myLastVelocity.x < 0) && (this.planetPicker.x < 0)))
                {
                    if (this.thisMag < this.nearestPick)
                    {
                        this.nearestPick = this.thisMag;
                        this.planetPicked = this.planetCandidate;
                    }
                }
            }
            this.planetCounter++;
        }
    }

    public virtual Vector3 EvaluatePlanet(Vector3 p, Vector3 v, bool xBig, float e, float i)
    {
        if (xBig)
        {
            if (((v.x > 0) && (p.x > 0)) || ((v.x < 0) && (p.x < 0)))
            {
                p.x = p.x * (e * e);
            }
            else
            {
                p.x = p.x * i;
            }
            if (((v.y > 0) && (p.y > 0)) || ((v.y < 0) && (p.y < 0)))
            {
                p.y = p.y * e;
            }
            else
            {
                p.y = p.y * i;
            }
        }
        else
        {
            if (((v.y > 0) && (p.y > 0)) || ((v.y < 0) && (p.y < 0)))
            {
                p.y = p.y * e;
            }
            else
            {
                p.y = p.y * i;
            }
            if (((v.x > 0) && (p.x > 0)) || ((v.x < 0) && (p.x < 0)))
            {
                p.x = p.x * e;
            }
            else
            {
                p.x = p.x * i;
            }
        }
        return p;
    }

    public virtual Vector3 SNVector3Lerp(Vector3 from, Vector3 to, float howMuch)
    {
        return new Vector3(((to.x - from.x) * howMuch) + from.x, ((to.y - from.y) * howMuch) + from.y, from.z);
    }

    public virtual Vector3 Subtract2d(Vector3 v, Vector3 v2)
    {
        return new Vector3(v.x - v2.x, v.y - v2.y, 0);
    }

    public virtual Vector3 Multiply2d(Vector3 v, float v2)
    {
        return new Vector3(v.x * v2, v.y * v2, 0);
    }

    public virtual float MathAbs(float f)
    {
        if (f < 0)
        {
            f = f * -1;
        }
        return f;
    }

    public virtual float SqrMagnitude2d(Vector3 v)
    {
        return Mathf.Abs((v.x * v.x) + (v.y * v.y));
    }

    public virtual void RemovePartsBeforeDestroy()
    {
        this.fireSmoke.Stop();
        this.fire1.Stop();
        this.fire2.Stop();
        this.fire.parent = null;
    }

    public virtual bool useRentCar() //return if use
    {
        //	if(gamegod.player2.forceGuide)
        //	{
        //		gamegod.player2.forceGuide = false;
        //	}
        //	if(gamegod.player1.forceGuide)
        //	{
        //		gamegod.player1.forceGuide = true;
        //		ActivatePower(ferrari);
        //	}
        //	else  if(currentPower != ferrari)
        //	{	
        //		if(GobalData.Instance.useRC())
        //		{
        //			ActivatePower(ferrari);
        //		 	return true;
        //		}
        //	}
        //	return false;
        if (this.gamegod.player2.forceGuide)
        {
            this.gamegod.player2.forceGuide = true;
            this.StartCoroutine(this.ActivatePower(this.ferrari));
        }
        if (this.gamegod.player1.forceGuide)
        {
            this.gamegod.player1.forceGuide = true;
            this.StartCoroutine(this.ActivatePower(this.ferrari));
        }
        else
        {
            if (this.currentPower != this.ferrari)
            {
                if (GobalData.Instance.useRC())
                {
                    this.StartCoroutine(this.ActivatePower(this.ferrari));
                    return true;
                }
            }
        }
        return false;
    }

    public virtual bool isPlayer1UseCar()
    {
        return this.currentPower == this.ferrari;
    }

    public virtual void swicthSpaceShip()
    {
        if (this.thisSpaceship && this.spaceshipMode)
        {
            this.spaceship = this.thisSpaceship.MySwitchShip(3).transform;
            this.thisSpaceship = (SpaceShip) this.spaceship.GetComponent("SpaceShip");
            this.shipHandling = this.thisSpaceship.handlingg;
            this.shipDoesntShake = this.thisSpaceship.doesntShake;
            this.myTransform.position = this.spaceship.position;

            {
                float _383 = this.myZ;
                Vector3 _384 = this.myTransform.position;
                _384.z = _383;
                this.myTransform.position = _384;
            }
            if (this.player2)
            {
                this.spaceshipGo = this.myTransform.position + new Vector3(1, 0, 0.05f);
            }
            else
            {
                this.spaceshipGo = this.myTransform.position + new Vector3(1, 0, 0);
            }
            this.myTransform.rotation = Quaternion.FromToRotation(Vector3.right, this.spaceship.TransformDirection(Vector3.up));
            this.canDrive = false;
            this.spaceship.parent = this.myTransform;
            this.spaceship.position = this.myTransform.position;
            this.spaceshipMode = true;
        }
    }

    public virtual void setDoubleJump(bool _doubleJump)
    {
        this.doubleJump = _doubleJump;
        PayAndroid.isDoubleJump = this.doubleJump;
    }

    public Player()
    {
        this.stay = 2;
        this.start = 1;
        this.end = 3;
        this.velocityLimit = 1;
        this.planetGravity = 4;
        this.heartsN = 3;
        this.magnet = 1;
        this.boomJetpack = 2;
        this.chickHammer = 3;
        this.ferrari = 4;
        this.pullNslice = 5;
        this.cologne = 6;
        this.hook = 7;
        this.stealth = 22;
    }

}