"use client";
//Global
import React, { useRef, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { setCookie } from "cookies-next";
//Components
import { Icons } from "@/components/Icons/Icons";
import { Checkbox, Button, Input, Select, SelectItem } from "@nextui-org/react";
import ForgetPasswordModal from "@/components/Modals/ForgetPasswordModal/ForgetPasswordModal";
import { showToastMessage } from "@/app/[locale]/toastsChange";
import InputMask from "react-input-mask";
//Utils
import { LOGIN_ROUTE, PROFILE_ROUTE } from "@/utils/Consts";
//Hooks
import { useCustomForm } from "@/hooks/useCustomForm.";
import { useTranslate } from "@/hooks/useTranslate";
import { useTypedSelector, useAppDispatch } from "@/hooks/useReduxHooks";
import { useUserActions } from "@/hooks/useUserActions";
//Types
import { IInputsRegistration } from "@/types/types";
import { Country } from "@/types/componentTypes";
//Prefixes
import prefixes from "@/locales/prefixes.json";
//Redux Types
import { IUserInformationApi } from "@/types/reduxTypes";
//Styles
import "./RegistrationComponent.scss";
import { getVerifySmsCode } from "@/services/authAPI";

export default function Registration({ nextStep }: { nextStep: () => void }) {
  //Hooks
  const { push } = useRouter();
  const translate = useTranslate();
  const dispatch = useAppDispatch();
  const { onRegistrationUser, onGetUser } = useUserActions();
  const { isAuth, status } = useTypedSelector((state) => state.user);
  const {
    returnInputError,
    returnInputProperties,
    isValid,
    getValues,
    handleSubmit,
    reset,
    setValue,
  } = useCustomForm<IInputsRegistration>();

  const [forgetModal, setForgetModal] = useState<boolean>(false);
  const [isCheckedContract, setIsCheckedContract] = useState(false);
  const [isCheckedSms, setIsCheckedSms] = useState(false);
  const [rememberMe, setRememberMe] = useState<boolean>(false);
  const [selectPhone, setSelectPhone] = useState<string>("");
  const [prefixCode, setPrefixCode] = useState<string>("+7");
  const [selectedCountry, setSelectedCountry] = useState<Country | null>(
    () =>
      prefixes.prefixes.find((country: Country) => country.code === "+7") ||
      null
  );

  const contentRef = useRef<HTMLDivElement>(null);
  const [isAgreedActive, setIsAgreedActive] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  // Scroll handler
  const handleScrollDown = () => {
    if (contentRef.current) {
      contentRef.current.scrollBy({ top: 200, behavior: "smooth" }); // Scrolls 150px down
    }
  };

  const selectClassName = {
    innerWrapper: "w-fit h-[30px]",
    popoverContent: "w-[130px] h-[250px]",
    mainWrapper: "w-[74px] h-[50px]",
    base: "w-[74px] h-[40px]",
    trigger: "shadow-none w-[74px] h-[40px] border border-r-0",
  };

  const createAccount = async () => {

    if (!isCheckedContract) {
      alert("Lütfen kullanıcı sözleşmesini onaylayın.");
      return;
    }

    if (!isValid) {
      showToastMessage("warn", translate.messageOrderFillFields);
      return;
    }

    try {
      const { email, first_name, last_name, password } = getValues();
      const requestBody: IUserInformationApi = {
        user: {
          phone_number: (prefixCode + selectPhone).replace(/[^\d+]/g, ""),
          email,
          first_name,
          last_name,
          password,
        },
        company: "company",
        address: "address",
      };
      const response = await onRegistrationUser(requestBody);

      if (response.payload.status === 200) {
        showToastMessage("success", translate.registrationSuccess);
        onGetUser();
        push(PROFILE_ROUTE);
        return;
      }
      if (response.payload.status === 201) {
        showToastMessage("success", translate.registrationSuccess);
        showToastMessage("warn", translate.registrationConfirm);
        getVerifySmsCode(
          response.payload.data.user.phone_number,
          "verification"
        );

        nextStep();
        setCookie("phoneNumber", selectPhone.replace(/[^\d+]/g, ""));
        setCookie("phonePrefix", prefixCode);

        return;
      }
      if ("error" in response && response.error.message === "Rejected") {
        showToastMessage("error", translate.messageRegistrationError);
        return;
      }

      if (rememberMe) {
        setCookie("userPhoneRemember", selectPhone.replace(/[^\d+]/g, ""));
        setCookie("phonePrefix", prefixCode);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const renderAllPrefixes = () => {
    if (!prefixes.prefixes)
      return (
        <SelectItem key="+1" value="+1">
          {translate.registrationError}
        </SelectItem>
      );

    return prefixes.prefixes?.map((country: Country) => (
      <SelectItem
        aria-label={`${country?.code}`}
        key={country?.code}
        value={`${country?.code}`}
      >
        <img
          src={country?.flag}
          alt={country?.name}
          className="inline-block w-4 h-4 mr-2"
        />
        {country?.code}
      </SelectItem>
    ));
  };

  const showModalForgetPassword = () => setForgetModal(!forgetModal);

  const handleCountryChange = (value: string) => {
    const country = prefixes.prefixes.find(
      (item: Country) => item.code === value
    );
    if (country) setSelectedCountry(country);
  };

  useEffect(() => {
    if (isAuth && status === "fulfilled") push(PROFILE_ROUTE);
  }, [isAuth, status, push]);

  if (isAuth || status === "pending") return <Icons id="spiner" />;

  return (
    <div className="form-wrapper">
      <div className="provider-stages-wrapper">
        <div className="provider-stages">
          <nav className="provider-stages-block">
            <div className="stage-link active"></div>
            <div className="stage-link"></div>
          </nav>

          <p className="provider-stages-text">
            {translate.registrationStage} 1/2
          </p>
        </div>
      </div>
      <form onSubmit={handleSubmit(createAccount)} className="form-content">
        <div className="form-content_header">
          <h5 className="form-content_header-title">
            {translate.registrationTitle}
          </h5>

          <p className="form-content_header-text">
            {translate.registrationButtonText}
          </p>
        </div>

        <div className="form-content_bottom">
          <label htmlFor="#" className="form-content_bottom-label">
            <span className="form-content_bottom-label-span">
              {translate.registrationLabelEmail}
            </span>

            <Input
              {...returnInputProperties("email")}
              placeholder={translate.registrationInputEmail}
              type="email"
              classNames={{ inputWrapper: "form-content_bottom-label-input" }}
            />
            {returnInputError("email")}
          </label>

          <label htmlFor="#" className="form-content_bottom-label">
            <span className="form-content_bottom-label-span">
              {translate.logInLabelPassword}
            </span>

            <Input
              {...returnInputProperties("password")}
              placeholder={translate.logInInputPassword}
              type="password"
              classNames={{ inputWrapper: "form-content_bottom-label-input" }}
            />
            {returnInputError("password")}
          </label>

          <label htmlFor="#" className="form-content_bottom-label">
            <span className="form-content_bottom-label-span">
              {translate.registrationLabelName}
            </span>

            <Input
              {...returnInputProperties("first_name")}
              placeholder={translate.registrationInputName}
              classNames={{ inputWrapper: "form-content_bottom-label-input" }}
            />
            {returnInputError("first_name")}
          </label>

          <label htmlFor="#" className="form-content_bottom-label">
            <span className="form-content_bottom-label-span">
              {translate.registrationLabelLastName}
            </span>

            <Input
              {...returnInputProperties("last_name")}
              placeholder={translate.registrationInputLastName}
              classNames={{ inputWrapper: "form-content_bottom-label-input" }}
            />
            {returnInputError("last_name")}
          </label>

          <label htmlFor="#" className="form-content_bottom-label">
            <span className="form-content_bottom-label-span">
              {translate.registrationPhoneNumber}
            </span>

            <div className="flex">
              {selectedCountry && (
                <img
                  src={selectedCountry.flag}
                  alt={selectedCountry.name}
                  className="imgStyle"
                />
              )}
              <Select
                radius="none"
                disallowEmptySelection
                defaultSelectedKeys={["+7"]}
                classNames={selectClassName}
                onChange={(event) => {
                  setPrefixCode(event.target.value);
                  handleCountryChange(event.target.value);
                }}
              >
                {renderAllPrefixes()}
              </Select>

              <InputMask
                {...returnInputProperties("phone_number")}
                data-phone
                className="form-content_bottom-label-input"
                mask="(999) 999-99-99"
                alwaysShowMask={true}
                onChange={(event) => setSelectPhone(event.target.value)}
              />
            </div>

            {returnInputError("phone_number")}
          </label>

          <div className="form-content_checkbox">
            <Checkbox
              className="form-content_checkbox-content"
              checked={isCheckedContract}
              onChange={(event) => setIsCheckedContract(event.target.checked)}
            >
              <span className="mr-1">{translate.politicsAgree1}</span>
              <span
                onClick={openModal}
                style={{
                  color: "blue",
                  cursor: "pointer",
                  textDecoration: "underline",
                }}
              >
                {translate.politicsAgree2}
              </span>
            </Checkbox>
          </div>
          <div className="form-content_checkbox">
            <Checkbox
              className="form-content_checkbox-content"
              value={translate.smsAgree}
              checked={isCheckedSms}
              onChange={(event) => setIsCheckedSms(event.target.checked)}
            >
              {translate.smsAgree}
            </Checkbox>
          </div>

          <div className="form-content_checkbox">
            <Checkbox
              className="form-content_checkbox-content"
              value={translate.registrationRememberMe}
              checked={rememberMe}
              onChange={(event) => setRememberMe(event.target.checked)}
            >
              {translate.logInCheckboxText}
            </Checkbox>

            <button
              onClick={showModalForgetPassword}
              className="form-content_checkbox-button"
            >
              {translate.logInTextForget}
            </button>
          </div>

          <Button
            type="submit"
            className="btnRegg text-white rounded-md w-full h-[44px] py-[10px]"
          >
            {translate.registrationButtonText}
          </Button>

          <Button
            onClick={() => push(LOGIN_ROUTE)}
            className="text-black rounded-md w-full h-[44px] py-[10px] bg-transparent"
          >
            {translate.registrationButtonLogIn}
          </Button>
        </div>
      </form>
      <ForgetPasswordModal
        forgetModal={forgetModal}
        setForgetModal={setForgetModal}
      />

      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div
              className="provider-text max-h-[40vh] overflow-auto"
              ref={contentRef}
            >
              <p className="politics-content_text font-bold">
                1. {translate["contract.1"]}
              </p>
              <p className="politics-content_text">
                1.1 {translate["contract.1.1"]}
              </p>
              <p className="politics-content_text">
                1.2 {translate["politics.1.2"]}
              </p>
              <p className="politics-content_text">
                {translate["contract.1.2.1"]}
              </p>
              <p className="politics-content_text">
                {translate["contract.1.2.2"]}
              </p>
              <p className="politics-content_text">
                {translate["contract.1.2.3"]}
              </p>

              <p className="politics-content_text font-bold">
                2. {translate["contract.2"]}
              </p>
              <p className="politics-content_text">
                2.1. {translate["contract.2.1"]}
              </p>
              <p className="politics-content_text">
                {translate["contract.2.1.1"]}
              </p>
              <p className="politics-content_text">
                {translate["contract.2.1.2"]}
              </p>
              <p className="politics-content_text">
                {translate["contract.2.1.3"]}
              </p>
              <p className="politics-content_text">
                2.2 {translate["contract.2.2"]}
              </p>
              <p className="politics-content_text">
                2.3 {translate["contract.2.3"]}
              </p>
              <p className="politics-content_text">
                2.4 {translate["contract.2.4"]}
              </p>

              <p className="politics-content_text font-bold">
                3. {translate["contract.3"]}
              </p>
              <p className="politics-content_text">
                3.1 {translate["contract.3.1"]}
              </p>
              <p className="politics-content_text">
                3.2 {translate["contract.3.2"]}
              </p>
              <p className="politics-content_text">
                3.3 {translate["contract.3.3"]}
              </p>
              <p className="politics-content_text">
                3.4 {translate["contract.3.4"]}
              </p>
              <p className="politics-content_text">
                3.5 {translate["contract.3.5"]}
              </p>
              <p className="politics-content_text">
                3.6 {translate["contract.3.6"]}
              </p>
              <p className="politics-content_text">
                3.7 {translate["contract.3.7"]}
              </p>
              <p className="politics-content_text">
                3.8.1 {translate["contract.3.8.1"]}
              </p>
              <p className="politics-content_text">
                3.8.2 {translate["contract.3.8.2"]}
              </p>
              <p className="politics-content_text">
                3.8.3 {translate["contract.3.8.3"]}
              </p>
              <p className="politics-content_text">
                3.8.4 {translate["contract.3.8.4"]}
              </p>
              <p className="politics-content_text">
                3.8.5 {translate["contract.3.8.5"]}
              </p>
              <p className="politics-content_text">
                3.9 {translate["contract.3.9"]}
              </p>
              <p className="politics-content_text">
                3.10 {translate["contract.3.10"]}
              </p>
              <p className="politics-content_text">
                3.11 {translate["contract.3.11"]}
              </p>
              <p className="politics-content_text">
                3.12 {translate["contract.3.12"]}
              </p>
              <p className="politics-content_text">
                3.13 {translate["contract.3.13"]}
              </p>
              <p className="politics-content_text">
                3.14 {translate["contract.3.14"]}
              </p>
              <p className="politics-content_text">
                3.15 {translate["contract.3.15"]}
              </p>

              <p className="politics-content_text font-bold">
                4. {translate["contract.4"]}
              </p>
              <p className="politics-content_text">
                4.1. {translate["contract.4.1"]}
              </p>
              <p className="politics-content_text">
                {translate["contract.4.2"]}
              </p>

              <p className="politics-content_text font-bold">
                5. {translate["contract.5"]}
              </p>
              <p className="politics-content_text">
                {translate["contract.5.1"]}
              </p>

              <p className="politics-content_text font-bold">
                6. {translate["contract.6"]}
              </p>
              <p className="politics-content_text">
                6.1. {translate["contract.6.1"]}
              </p>
              <p className="politics-content_text">
                6.2 {translate["contract.6.2"]}
              </p>
              <p className="politics-content_text">
                6.3. {translate["contract.6.3"]}
              </p>
              <p className="politics-content_text">
                6.4 {translate["contract.6.4"]}
              </p>

              <p className="politics-content_text font-bold">
                7. {translate["contract.7"]}
              </p>
              <p className="politics-content_text">
                {translate["contract.7.1"]}
              </p>
              <p className="politics-content_text">
                {" "}
                {translate["contract.7.1.1"]}
              </p>
            </div>

            <div className="pt-2">
              {!isAgreedActive && ( // Butonu okuma tamamlanmadıysa göster
                <Button onClick={handleScrollDown}>
                  {translate.politicsRead}
                </Button>
              )}

              <Button className="ml-4 bg-red-400" onClick={closeModal}>
                {" "}
                {translate.politicsClose}{" "}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
