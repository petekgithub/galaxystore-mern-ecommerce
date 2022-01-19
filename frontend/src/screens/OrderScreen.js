import React, { useState, useEffect } from 'react'
import axios from 'axios'
import  { PayPalButton } from 'react-paypal-button-v2'
import { Link } from 'react-router-dom'
import { Row, Col, ListGroup, Image, Card } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import Message from '../components/Message'
import { useParams } from 'react-router-dom';
import Loader from '../components/Loader';
import { getOrderDetails, payOrder } from '../actions/orderActions';
import { useNavigate } from 'react-router-dom';
import { ORDER_PAY_RESET } from '../constants/orderConstants'


// whole order coming from database

const OrderScreen = ({ }) => {

    //	const orderId = match.params.id
    const { id } = useParams(); // <-- access id match param here, id means orderId

    const navigate = useNavigate();

    const [sdkReady, setSdkReady] = useState(false)
    const dispatch = useDispatch()
 
    const orderDetails = useSelector((state) => state.orderDetails)
    const { order, loading, error } = orderDetails
 
    const orderPay = useSelector((state) => state.orderPay)
    const { loading: loadingPay, success: successPay } = orderPay
 
 
    // const userLogin = useSelector((state) => state.userLogin)
    // const { userInfo } = userLogin
 
    if (!loading) {
        //   Calculate prices
        const addDecimals = (num) => {
            return (Math.round(num * 100) / 100).toFixed(2)
        }
 
        order.itemsPrice = addDecimals(
            order.orderItems.reduce((acc, item) => acc + item.price * item.qty, 0)
        )
    }
 
    useEffect(() => {
        // if (!userInfo) {
        //     navigate('/login')
        // }
        const addPayPalScript = async () => {
            const { data: clientId } = await axios.get('/api/config/paypal')
            const script = document.createElement('script')
            script.type = 'text/javascript'
            script.src = `https://www.paypal.com/sdk/js?client-id=${clientId}`
            script.async = true
            script.onload = () => {
                setSdkReady(true)
            }
            document.body.appendChild(script)
        }
 
        if(!order || successPay) {
            dispatch({ type: ORDER_PAY_RESET })
            dispatch(getOrderDetails(id))
        }else if(!order.isPaid){
            if(!window.paypal)  {
                addPayPalScript()
            } else{
                setSdkReady(true)
            }
        }
    }, [dispatch, id, successPay, order]) 
 
    const successPaymentHandler = (paymentResult) => {
        console.log(paymentResult)
        dispatch(payOrder(id, paymentResult))
    }
 
    // const deliverHandler = () => {
    //     dispatch(deliverOrder(order))
    // }
 
    return loading
        ? <Loader />
        : error
            ? <Message variant='danger'>{error}</Message> :
        (
            <>
                <span className='align-baseline h2'>Order</span>
                <span className='align-baseline h3 text-success ml-2'>{order._id}</span>
                <Row>
                    <Col md={8}>
                        <ListGroup variant='flush'>
                            <ListGroup.Item>
                                <h2>Shipping</h2>
                                <p>
                                    <strong>Name:</strong> {order.user.name}
                                </p>
                                <p>
                                    <strong>Email:</strong>
                                    <a
                                        href={`mailto:${order.user.email}`}
                                        className='ml-2'
                                    >
                                        {order.user.email}
                                    </a>
                                </p>
                                <p>
                                    <strong>Address:</strong>
                                    {order.shippingAddress.address},{' '}
                                    {order.shippingAddress.city},{' '}
                                    {order.shippingAddress.postalCode},{' '}
                                    {order.shippingAddress.country}
                                </p>
                                {order.isDelivered ? (
                                    <Message variant='success'>Delivered on {order.deliveredAt}</Message>
                                ) : (
                                    <Message variant='danger'>Not Delivered</Message>
                                )}
                            </ListGroup.Item>
 
                            <ListGroup.Item>
                                <h2>Payment Method</h2>
                                <p>
                                    <strong>Method: </strong>
                                    {order.paymentMethod}
                                </p>
                                {order.isPaid ? (
                                    <Message variant='success'>Paid on {order.paidAt}</Message>
                                ) : (
                                    <Message variant='danger'>Not Paid</Message>
                                )}
                            </ListGroup.Item>
 
                            <ListGroup.Item>
                                <h2>
                                    Order Items
                                ({order.orderItems.reduce((acc, item) => acc + item.qty, 0)})
                            </h2>
 
                                {order.orderItems.length === 0 ? (
                                    <Message>Your order is empty</Message>
                                ) : (
                                    <ListGroup variant='flush'>
                                        {order.orderItems.map((item, index) => (
 
                                            <ListGroup.Item key={index}>
                                                <Row>
                                                    <Col md={3}>
                                                        <Image
                                                            src={item.image}
                                                            alt={item.name}
                                                            fluid
                                                            rounded
                                                        />
                                                    </Col>
                                                    <Col>
                                                        <Link to={`/product/${item.product}`}>
                                                            {item.name}
                                                        </Link>
                                                    </Col>
                                                    <Col md={4}>
                                                        {item.qty} x €{item.price} = €{item.qty * item.price}
                                                    </Col>
                                                </Row>
                                            </ListGroup.Item>
 
                                        ))}
                                    </ListGroup>
                                )
                                }
                            </ListGroup.Item>
 
                        </ListGroup>
                    </Col >
                    <Col md={4}>
                        <Card>
                            <ListGroup> 
                                <ListGroup.Item>
                                    <h2>Order Summary</h2>
                                    <strong>*Free shipping for total items over €100</strong>
                                </ListGroup.Item>
                                <ListGroup.Item>
                                    <Row>
                                        <Col>
                                            Items
                                        ({order.orderItems.reduce((acc, item) => acc + item.qty, 0)})
                                    </Col>
                                        <Col>${order.itemsPrice}</Col>
                                    </Row>
                                </ListGroup.Item>
                                <ListGroup.Item>
                                    <Row>
                                        <Col>Shipping</Col>
                                        <Col>€{order.shippingPrice}</Col>
                                    </Row>
                                </ListGroup.Item>
                                <ListGroup.Item>
                                    <Row>
                                        <Col>Tax</Col>
                                        <Col>€{order.taxPrice}</Col>
                                    </Row>
                                </ListGroup.Item>
                                <ListGroup.Item>
                                    <Row>
                                        <Col>Total</Col>
                                        <Col>€{order.totalPrice}</Col>
                                    </Row>
                                </ListGroup.Item>
                                {!order.isPaid && (
                                    <ListGroup.Item>
                                        {loadingPay && <Loader/>}
                                        {!sdkReady ? <Loader /> : (
                                             <PayPalButton 
                                             amount={order.totalPrice} 
                                             onSuccess={successPaymentHandler}
                                             />
                                        )}
                                    </ListGroup.Item>
                                )}
                            </ListGroup>
                        </Card>
                    </Col>
                </Row >
            </ >
        )
}
 
export default OrderScreen