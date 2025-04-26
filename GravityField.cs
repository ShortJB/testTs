using UnityEngine;
using System.Collections;

[System.Serializable]
public partial class GravityField : MonoBehaviour
{
    public float myMass = 1f;
    public bool planet = true;
    public bool menuPlanet = true;
    public bool firstPlanet;
    public bool blackHole;
    public bool animated;

    [Header("回正参数")]
    public bool enableReset = true;
    public float resetSpeed = 1f;
    public float resetThreshold = 0.01f;

    public Transform myTransform;
    public Rigidbody myRigidbody;

    private Vector3 initialPosition;
    private Quaternion initialRotation;

    public virtual void Awake()
    {
        myTransform = this.transform;
        myRigidbody = GetComponent<Rigidbody>();

        if (planet)
        {
            myRigidbody.isKinematic = false;  // 菜单星球也允许动

            if (menuPlanet)
            {
                myMass = 2.5f;  // 大质量，防止飞走
            }
            else
            {
                myMass = Mathf.Lerp(myMass, 0.5f, 0.5f);
            }
        }
        else
        {
            myMass = 0.3f;
        }

        if (myRigidbody != null)
        {
            myRigidbody.mass = myMass;
            myRigidbody.useGravity = false;
        }

        // 记录初始位置和旋转
        initialPosition = myTransform.position;
        initialRotation = myTransform.rotation;
    }

    public virtual void FixedUpdate()
    {
        if (!enableReset || myRigidbody == null)
            return;

        // 平滑回到初始位置
        Vector3 posDelta = initialPosition - myTransform.position;
        if (posDelta.sqrMagnitude > resetThreshold * resetThreshold)
        {
            Vector3 move = posDelta * resetSpeed * Time.fixedDeltaTime;
            myRigidbody.MovePosition(myTransform.position + move);
        }

        // 平滑回到初始旋转
        Quaternion rotDelta = Quaternion.Inverse(myTransform.rotation) * initialRotation;
        float angle;
        Vector3 axis;
        rotDelta.ToAngleAxis(out angle, out axis);

        if (angle > resetThreshold)
        {
            Quaternion deltaRotation = Quaternion.AngleAxis(angle * resetSpeed * Time.fixedDeltaTime, axis);
            myRigidbody.MoveRotation(deltaRotation * myTransform.rotation);
        }
    }
}
