"use client";
//Global
import Link from "next/link";
import { useEffect, useState } from "react";
import { showToastMessage } from "@/app/[locale]/toastsChange";
import { getAllCities } from "@/services/productsAPI";
import { BreadcrumbItem, Breadcrumbs } from "@nextui-org/react";
import { Dispatch, SetStateAction } from "react";
//Components
import {
  Button,
  Radio,
  RadioGroup,
  Select,
  Input, 
  SelectItem,
} from "@nextui-org/react";
//Hooks
import { useTranslate } from "@/hooks/useTranslate";
import { useTypedSelector } from "@/hooks/useReduxHooks";
import { useCart } from "@/hooks/useCart";
//Utils
import { BASKET_ROUTE, POLITIC_ROUTE, SHOP_ROUTE } from "@/utils/Consts";
//Services
import {
  postToOrder,
  getAllTariffies,
  getCalculateDeliveryPrice,
} from "@/services/paymentAPI";
//Styles
import "./ConfirmOrder.scss";

interface City {
  id: number;
  name: string;
}
interface Tariffes {
  id: number;
  name: string;
}

interface DeliveryPrice {
  total_delivery_price?: string;
  total_weight?: string;
}

export default function ConfirmOrder({
  nextStep,
  selectedPayment,
  setSelectedPayment,
  setOrderId,
}: {
  nextStep: () => void;
  selectedPayment: string;
  setSelectedPayment: Dispatch<SetStateAction<string>>;
  setOrderId: Dispatch<SetStateAction<string>>;
}) {
  //Hooks
  const translate = useTranslate();
  const { cart } = useTypedSelector((state) => state.cart);
  const { userState } = useTypedSelector((state) => state.user);
  const { returnAllProductsCounter, onFetchCart } = useCart();

  const [allCities, setAllCities] = useState<City[]>([]);
  const [selectedCity, setSelectedCity] = useState<number>(0);
  const [address, setAddress] = useState<string>("");
  const [name, setName] = useState<string>("");
  const [selectedTarif, setSelectedTarif] = useState<string>("0");
  const [allTariffies, setAllTariffies] = useState<Tariffes[]>([]);
  const [deliveryPrices, setDeliveryPrices] = useState<DeliveryPrice>();

  //get
  const getCities = async () => {
    try {
      const response = await getAllCities();
      if (response?.status === 200) {
        setAllCities(response?.data);
      }
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };
  const getTariffies = async () => {
    try {
      const response = await getAllTariffies();

      if (response?.status === 200) {
        setAllTariffies(response?.data);
        return;
      }
      if (response?.response?.status) {
        showToastMessage("warn", translate.messageOrderTariffsError);
        return;
      }
    } catch (error) {
      console.error(error);
    }
  };

  const getDeliveryData = async (city: number, tarif: number) => {
    if (city > 0 && tarif > 0) {
      try {
        const response = await getCalculateDeliveryPrice({
          city_id: Number(city),
          tariff_id: Number(tarif),
        });
        if (response?.status === 200) {
          setDeliveryPrices(response.data);
          return;
        }
        if (response?.status === 400) {
          showToastMessage("warn", "Error");
          return;
        }
      } catch (error) {
        console.error(error);

        const errorMessage: DeliveryPrice = {
          total_delivery_price: translate.messageCalculateDeliveryPrice,
          total_weight: "",
        };

        setDeliveryPrices(errorMessage);
        showToastMessage("warn", translate.messageCalculateDeliveryPrice);
      }
    }
  };

  //Render
  const mapTariffes = () =>
    allTariffies?.map(({ name, id }) => (
      <Radio
        aria-label="select-tatif"
        key={id}
        classNames={{ label: "text-textAcc" }}
        value={String(id)}
        onChange={() => {
          setSelectedTarif(id.toString());
          getDeliveryData(selectedCity, Number(id)); //id = tariff
        }}
      >
        {name}
      </Radio>
    ));

  const renderCities = () =>
    allCities?.map(({ name, id }) => (
      <SelectItem
        aria-label="selected-city"
        key={name}
        onClick={() => {
          setSelectedCity(id);
          getDeliveryData(Number(selectedTarif), id); //id = city
        }}
      >
        {name}
      </SelectItem>
    ));

  //Handle
  const handlePostUserOrder = async () => {
    try {
      const productsId = cart?.order_products.map(({ id }) => id);

      const requestBody = {
        delivery: {
          city: selectedCity,
          tariff: selectedTarif,
          address: address,
          name: name,
        },
        order_products: productsId,
      };

      const response = await postToOrder(requestBody);
      if (response?.status === 201) {
        showToastMessage("success", translate.messageOrderSuccess);
        showToastMessage("warn", translate.messageOrderGoPayment);
        setOrderId(response?.data?.order_id);
        localStorage.setItem("deliveryCost", response?.data?.delivery?.price);
        nextStep();
      }
      if (response?.response?.status === 400) {
        showToastMessage("warn", translate.messageOrderFillFields);
      }
      if (response?.response?.status === 401) {
        showToastMessage("error", translate.messageOrderAuthError);
      }
    } catch (error) {
      showToastMessage("error", translate.messageOrderError);
    }
  };

  useEffect(() => {
    onFetchCart();

    localStorage.removeItem("deliveryCost");
  }, []);

  useEffect(() => {
    onFetchCart();
  }, [onFetchCart]);

  useEffect(() => {
    getTariffies();
    getCities();
  }, [translate]);

  return (
    <main className="container mx-auto mt-[30px] flex flex-col justify-center mb-[70px] px-[15px] lg:px-[30px]">
      <Breadcrumbs>
        <BreadcrumbItem href={SHOP_ROUTE}>
          {translate.mainPageRoute}
        </BreadcrumbItem>
        <BreadcrumbItem href={BASKET_ROUTE}>
          {translate.headerCart}
        </BreadcrumbItem>
        <BreadcrumbItem>{translate.orderPageButton}</BreadcrumbItem>
      </Breadcrumbs>

      <div className="w-full flex flex-col lg:grid grid-cols-2 gap-[40px] sm:gap-[79px]">
        <div className="flex flex-col gap-[45px]">
          <h2 className="family-medium text-[32px]">
            {translate.orderPagePersonalData}
          </h2>

          <form className="flex flex-col gap-[20px]">
            <div className="flex flex-col gap-[17px]">
              <label className="text-[18px] flex flex-col gap-[5px]">
                {translate.registrationLabelName}

                <Input
                    placeholder={`${translate.registrationLabelName}...`}
                    classNames={{ inputWrapper: "inputs-order" }}
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
              </label>
            </div>

            <div className="flex flex-col gap-[17px]">
              <label className="text-[18px] flex flex-col gap-[5px]">
                {translate.orderPagePhone}
                <div className="inputs-order truncate">
                  {userState?.user.phone_number}
                </div>
              </label>
            </div>

            <div className="flex flex-col gap-[17px]">
              <label className="text-[18px] flex flex-col gap-[5px]">
                {translate.registrationLabelEmail}

                <div className="inputs-order truncate">
                  {userState?.user.email}
                </div>

                <span className="text-[12px] text-textAcc">
                  {translate.orderPageEmailText}
                </span>
              </label>
            </div>

            <div className="flex flex-col gap-[17px]">
              <label className="text-[18px] flex flex-col gap-[5px]">
                {translate.paymentSelectCity}
                <Select
                  label={translate.paymentSelectCity}
                  aria-label="select-cities"
                  radius="none"
                  disallowEmptySelection
                  classNames={{
                    trigger: "border-1 border-border shadow-none rounded-md",
                  }}
                >
                  {renderCities()}
                </Select>
              </label>
            </div>

            <div className="flex flex-col gap-[17px]">
              <label className="text-[18px] flex flex-col gap-[5px]">
                {translate.paymentAddress}
                  <Input
                    placeholder={`${translate.paymentAddress}...`}
                    classNames={{ inputWrapper: "inputs-order" }}
                    type="text"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                  />
              </label>
            </div>

            <div className="flex flex-col">
              <p className="text-[18px] mb-[10px]">
                {translate.paymentSelectTarif}
              </p>

              <RadioGroup
                aria-label="select-cardSystem"
                value={String(selectedTarif)}
                onValueChange={setSelectedTarif}
              >
                {mapTariffes()}
              </RadioGroup>
            </div>
          </form>
        </div>

        <div className="flex flex-col gap-[15px]">
          <h2 className="text-[32px] family-medium">
            {translate.orderPageCart}
          </h2>

          <p className="text-[20px] text-textGray">
            {translate.orderPageTotal}:
          </p>

          <div className="flex flex-col gap-[4px] text-textGray">
            <div className="flex justify-between">
              <p> {translate.totalWeightText} :</p>
              <p>{deliveryPrices?.total_weight}</p>
            </div>

            <div className="flex justify-between">
              <p>{translate.totalDeliveryPriceText} :</p>
              <p>{deliveryPrices?.total_delivery_price}</p>
            </div>

            <div className="flex justify-between  py-3">
              <p className="text-[24px] text-textGray">
                {translate.orderPageSum}
              </p>

              <p className="text-[24px] text-black">
                {new Intl.NumberFormat("en-US", {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                }).format(
                  Number(cart?.total_sum || 0) +
                    (deliveryPrices?.total_delivery_price &&
                    !isNaN(Number(deliveryPrices.total_delivery_price))
                      ? Number(deliveryPrices.total_delivery_price)
                      : 0)
                )}
                $
              </p>
            </div>

            <div className="flex justify-between">
              <p>
                {returnAllProductsCounter()} {translate.orderPageProductsText}
              </p>

              <p>
                {new Intl.NumberFormat("en-US", {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                }).format(
                  Number(cart?.total_sum || 0) +
                    (deliveryPrices?.total_delivery_price &&
                    !isNaN(Number(deliveryPrices.total_delivery_price))
                      ? Number(deliveryPrices.total_delivery_price)
                      : 0)
                )}
                $
              </p>
            </div>
          </div>

          <div className="flex flex-col py-4">
            <p className="text-[18px] mb-[10px]">{translate.paymentMethod}</p>

            <RadioGroup
              aria-label="select-cardSystem"
              value={selectedPayment}
              onValueChange={setSelectedPayment}
            >
              <Radio
                aria-label="select-tatif"
                key={"card"}
                classNames={{ label: "text-textAcc" }}
                value={"card"}
              >
                {translate.paymentMethodCard}
              </Radio>
              <Radio
                aria-label="select-tatif"
                key={"details"}
                classNames={{ label: "text-textAcc" }}
                value={"details"}
              >
                {translate.paymentMethodDetails}
              </Radio>
            </RadioGroup>
          </div>

          <Button
            onClick={handlePostUserOrder}
            className="button-change text-[22px] text-white rounded-lg w-full h-[63px] py-[10px]"
            disabled={
              !deliveryPrices?.total_weight ||
              Number(deliveryPrices.total_weight) <= 0
            }
          >
            {translate.orderPageButton}
          </Button>

          <div className="text-textAcc">
            {translate.orderPageLinkText}{" "}
            <Link href={POLITIC_ROUTE} className="text-textGray politics">
              {translate.orderPageLink}
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
