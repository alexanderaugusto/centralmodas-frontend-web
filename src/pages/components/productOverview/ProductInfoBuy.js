import React, { useState, useEffect, useCallback } from "react"
import {
  Row,
  Col,
  CardTitle,
  Input,
  FormGroup,
  Form
} from "reactstrap"
import { Button, CardDescription } from "../../../components"
import { getFreightTerm } from "../../../constants"
import { insertCartItem } from "../../../redux/actions/cartAction"
import { insertFavoriteItem } from "../../../redux/actions/favoriteAction"
import { freightCalculator } from "../../../redux/actions/productAction"
import { useDispatch, useSelector } from "react-redux"

import "./ProductOverview.css"

export default function ProductInfoBuy({ product, history }) {
  const [userFreteInfo, setUserFreteInfo] = useState({ day: "", month: "", value: "" })
  const [freteInfo, setFreteInfo] = useState(null)
  const [cep, setCep] = useState("")

  // Redux
  const dispatch = useDispatch()
  const { mainAddress } = useSelector(state => state.userReducer)

  const freteCalculator = useCallback(async (start) => {
    if (((cep.length === 9 && cep.includes("-")) || (cep.length === 8 && !cep.includes("-")))) {
      dispatch(
        freightCalculator(cep, product, (data) => {
          const { day, month } = data.date_end

          let freightInfo = {
            day,
            month: getFreightTerm(parseInt(month, 10) - 1),
            value: data.value.replace(".", ",")
          }
          setFreteInfo(freightInfo)
        }))
    } else {
      dispatch({ type: "OPEN_ALERT", payload: { type: "error", message: "CEP inválido! Por favor, digite um cep válido." } })
    }
  }, [cep, product, dispatch])

  useEffect(() => {
    if (mainAddress && mainAddress.length !== 0) {
      dispatch(
        freightCalculator(mainAddress.zipcode, product, (data) => {
          const { day, month } = data.date_end

          let freightInfo = {
            day,
            month: getFreightTerm(parseInt(month, 10) - 1),
            value: data.value.replace(".", ",")
          }
          setUserFreteInfo(freightInfo)
        }))
    }
  }, [mainAddress, dispatch, product])

  function buyProduct() {
    dispatch(insertCartItem(product.id, history))
  }

  if (!product)
    return null

  return (
    <div>
      <div>
        <CardTitle>{product.title}</CardTitle>
        <Row>
          <Col className="text-left" md={8} xs={12}>
            <CardTitle className="card-title-price">
              {`R$ ${product.price.toString().replace(".", ",").replace(/\B(?=(\d{3})+(?!\d))/g, ".")}`}
            </CardTitle>
            <CardDescription> Em até 12x de R$ 15,99 </CardDescription>
          </Col>
          <Col className="text-right" md={4} xs={12}>
            <Button className="favourite-icon-grid button-animation-grow" icon color="link"
              onClick={() => dispatch(insertFavoriteItem(product.id))}>
              <i className="now-ui-icons ui-2_favourite-28" />
            </Button>
          </Col>
        </Row>

      </div>

      {!mainAddress || mainAddress.length === 0 ? null :
        <div>
          <CardDescription color="#28a745" fontWeight="400">
            {`O produto será entregue a partir do dia ${userFreteInfo.day} de ${userFreteInfo.month} por R$ ${userFreteInfo.value}`}
          </CardDescription >
          <CardDescription className="address-description">
            {`Enviar para ${mainAddress.street} ${mainAddress.number}`}
          </CardDescription>
        </div>}

      <Button
        block
        round
        color="info"
        className="mb-3"
        onClick={() => buyProduct()}
      >
        Comprar
      </Button>
      <Button
        block
        round
        color="simple"
        className="mb-3 button-add-cart"
        onClick={() => dispatch(insertCartItem(product.id))}
      >
        Adiconar ao carrinho
      </Button>

      <div className="company-div">
        <CardDescription marginBottom={2} fontWeight="bold">Vendido e entregue por
          <a href=" #" target="_blank">{" " + product.company.name}</a>
        </CardDescription>
        <CardDescription>{product.company.city + " - " + product.company.state}</CardDescription>
      </div>

      <div>
        <CardDescription color="black" fontSize="17px">Consultar prazos e fretes</CardDescription>
        <Form onSubmit={(e) => {
          e.preventDefault()
          freteCalculator()
        }}>
          <Row>
            <Col xs={7}>
              <FormGroup>
                <Input placeholder="Digite um CEP..." value={cep} onChange={(e) => setCep(e.target.value)} />
              </FormGroup>
            </Col>
            <Col xs={5}>
              <Button
                block
                round
                color="info"
                style={{ marginTop: "-3px" }}
                className="mb-3"
              >
                Calcular
              </Button>
            </Col>
          </Row>
          {!freteInfo ? null :
            <Row>
              <Col>
                <CardDescription fontWeight="400">
                  {`O produto será entregue a partir do dia ${freteInfo.day} de ${freteInfo.month} por R$ ${freteInfo.value}`}
                </CardDescription >
              </Col>
            </Row>}
        </Form>

      </div>
    </div>
  )
}