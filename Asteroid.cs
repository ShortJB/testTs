using UnityEngine;
using System.Collections;

[RequireComponent(typeof(Rigidbody))]
public partial class Asteroid : MonoBehaviour
{
    public Rigidbody myRigidbody;
    public Transform myTransform;
    private Vector3 myPos;
    private Vector3 getBackForce;
    private bool shouldUpdate;
    private int frameCounter;
    private bool nowVisible;
    private Vector3 lastVelocity;
    private Camera cam;
    private int camWidth;
    private int gapSize;
    private int thistance;

    // 调整参数
    public float backForceStrength = 5f;     // 返回原位的力量大小
    public float maxSpeed = 2f;               // 陨石最大速度
    public float distanceThreshold = 0.5f;    // 偏离多远才拉回

    private PhysicMaterial asteroidMaterial;

    public virtual void Start()
    {
        myPos = myTransform.position;
        cam = Camera.main;
        camWidth = cam.pixelWidth;
        gapSize = (int)(cam.pixelWidth * 0.2f);

        asteroidMaterial = new PhysicMaterial();
        asteroidMaterial.dynamicFriction = 1.0f;
        asteroidMaterial.staticFriction = 1.0f;
        asteroidMaterial.frictionCombine = PhysicMaterialCombine.Maximum;

        if (GetComponent<Collider>() != null)
        {
            GetComponent<Collider>().material = asteroidMaterial;
        }

        myRigidbody.mass = 1.8f;
        myRigidbody.drag = 1.0f;
        myRigidbody.angularDrag = 30f;
    }

    public virtual void OnBecameVisible()
    {
        if (!nowVisible)
        {
            shouldUpdate = true;
            nowVisible = true;
            myRigidbody.velocity = lastVelocity;
            StartCoroutine(UpdateThis());
        }
    }

    public virtual void OnBecameInvisible()
    {
        if (nowVisible)
        {
            nowVisible = false;
            lastVelocity = myRigidbody.velocity;
        }
    }

    public virtual IEnumerator UpdateThis()
    {
        while (shouldUpdate)
        {
            if (!nowVisible)
            {
                if (frameCounter == 10)
                {
                    thistance = (int)cam.WorldToScreenPoint(myPos).x;
                    if (thistance > (camWidth + gapSize) || thistance < -gapSize)
                    {
                        myRigidbody.velocity = Vector3.zero;
                        myTransform.position = myPos;
                        shouldUpdate = false;
                        yield break;
                    }
                }
            }
            else
            {
                if (frameCounter == 10)
                {
                    frameCounter = 0;

                    Vector3 offset = myTransform.position - myPos;
                    offset.z = 0;

                    if (offset.sqrMagnitude > distanceThreshold * distanceThreshold)
                    {
                        getBackForce = -offset.normalized * backForceStrength;

                        if (Time.timeScale != 0)
                        {
                            myRigidbody.AddForce(getBackForce, ForceMode.Force);
                        }
                    }

                    // 限制陨石最大速度
                    if (myRigidbody.velocity.magnitude > maxSpeed)
                    {
                        myRigidbody.velocity = myRigidbody.velocity.normalized * maxSpeed;
                    }
                }
            }

            if (frameCounter > 10)
            {
                frameCounter = 0;
            }
            frameCounter++;
            yield return null;
            yield return null;
        }
    }

    public Asteroid()
    {
    }
}
