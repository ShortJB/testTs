using UnityEngine;
using System.Collections;

[System.Serializable]
public partial class Asteroid : MonoBehaviour
{
    public Rigidbody myRigidbody;
    public Transform myTransform;
    private int velocityLimit;
    private Vector3 myPos;
    private Vector3 getBackForce;
    private bool shouldUpdate;
    private int frameCounter;
    private bool nowVisible;
    private bool shouldSleep;
    private GameObject thisGO;
    private int contact;
    private Vector3 lastVelocity;
    private Transform camT;
    private Camera cam;
    private int camWidth;
    private int gapSize;
    private int thistance;
    public virtual void Start()
    {
        this.myPos = this.myTransform.position; //记录初始位置
        this.cam = Camera.main;
        this.camT = this.cam.transform;
        this.camWidth = this.cam.pixelWidth;
        this.gapSize = (int) (this.cam.pixelWidth * 0.2f);
    }

    public virtual void OnBecameVisible()
    {
        if (!this.nowVisible)
        {
            this.shouldUpdate = true;
            this.nowVisible = true;
            this.myRigidbody.velocity = this.lastVelocity;
            this.StartCoroutine(this.UpdateThis());
        }
    }

    public virtual void OnBecameInvisible()
    {
        if (this.nowVisible)
        {
            this.nowVisible = false;
            this.lastVelocity = this.myRigidbody.velocity;
        }
    }

    public virtual IEnumerator UpdateThis()
    {
        while (this.shouldUpdate)
        {
            if (!this.nowVisible)
            {
                if (this.frameCounter == 10)
                {
                    this.thistance = (int) this.cam.WorldToScreenPoint(this.myPos).x;
                    if ((this.thistance > (this.camWidth + this.gapSize)) || (this.thistance < -this.gapSize)) //如果离摄像机过远，则自动返回原来的位置
                    {
                        this.myRigidbody.velocity = Vector3.zero;
                        this.myTransform.position = this.myPos;
                        this.shouldUpdate = false;
                        yield break;
                    }
                }
            }
            else
            {
                if (this.frameCounter == 10) //满十帧调用
                {
                    this.frameCounter = 0;
                    if (this.SqrMagnitude2d(this.Subtract2d(this.myPos, this.myTransform.position)) > 0.6f) //计算到原始位置的距离，如果过大，则添加返回原位置的力
                    {
                        this.getBackForce = this.Subtract2d(this.myPos, this.myTransform.position);
                        if (Time.timeScale != 0)
                        {
                            this.myRigidbody.AddForce(this.getBackForce);
                        }
                    }
                }
            }
            if (this.frameCounter > 10)
            {
                this.frameCounter = 0;
            }
            this.frameCounter++;
            yield return null;
            yield return null;
        }
    }

    public virtual void OnCollisionEnter(Collision c)
    {
        if (this.nowVisible)
        {
            this.shouldSleep = false;
        }
        this.thisGO = c.gameObject;
        if (this.thisGO.layer == 15) //Level Limits	
        {
            this.myRigidbody.AddForce(c.contacts[0].normal * 10);
        }
    }

    public virtual Vector3 Subtract2d(Vector3 v, Vector3 v2)
    {
        return new Vector3(v.x - v2.x, v.y - v2.y, 0);
    }

    public virtual float SqrMagnitude2d(Vector3 v)
    {
        return (v.x * v.x) + (v.y * v.y);
    }

    public virtual Vector3 ClampVector3(Vector3 v, float f)
    {
        if (v.x > f)
        {
            v.x = f;
        }
        else
        {
            if (v.x < -f)
            {
                v.x = -f;
            }
        }
        if (v.y > f)
        {
            v.y = f;
        }
        else
        {
            if (v.y < -f)
            {
                v.y = -f;
            }
        }
        return v;
    }

    public virtual float SNFloatLerp(float from, float to, float howMuch)
    {
        return ((to - from) * howMuch) + from;
    }

    public virtual Vector3 SNVector3Lerp(Vector3 from, Vector3 to, float howMuch)
    {
        return new Vector3(((to.x - from.x) * howMuch) + from.x, ((to.y - from.y) * howMuch) + from.y, from.z);
    }

    public virtual float MathAbs(float f)
    {
        if (f < 0)
        {
            f = f * -1;
        }
        return f;
    }

    public Asteroid()
    {
        this.velocityLimit = 1;
    }

}