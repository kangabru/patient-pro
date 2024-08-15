require "test_helper"

class PatientsControllerTest < ActionDispatch::IntegrationTest
  setup do
    @patient = patients(:one)
  end

  test "should get index" do
    get patients_url, as: :json
    assert_response :success
  end

  test "should create patient" do
    assert_difference("Patient.count") do
      post patients_url, params: { patient: { date_of_birth: @patient.date_of_birth, email: @patient.email, first_name: @patient.first_name, gender: @patient.gender, last_name: @patient.last_name, phone_number: @patient.phone_number } }, as: :json
    end

    assert_response :created
  end

  test "should show patient" do
    get patient_url(@patient), as: :json
    assert_response :success
  end

  test "should update patient" do
    patch patient_url(@patient), params: { patient: { date_of_birth: @patient.date_of_birth, email: @patient.email, first_name: @patient.first_name, gender: @patient.gender, last_name: @patient.last_name, phone_number: @patient.phone_number } }, as: :json
    assert_response :success
  end

  test "should not update patient with invalid data" do

    # Test partial passes
    patch patient_url(@patient), params: { patient: { first_name: @patient.first_name } }, as: :json
    assert_response :success

    # Required
    patch patient_url(@patient), params: { patient: {
      first_name: "",
      last_name: "",
      date_of_birth: Date.tomorrow,
      gender: "invalid gender",
      phone_number: "invalid_number",
      email: "invalid_email",
    } }, as: :json
    assert_response :unprocessable_entity
    body = JSON.parse(response.body)
    assert_equal body['first_name'], ["can't be blank"]
    assert_equal body['last_name'], ["can't be blank"]
    assert_equal body['date_of_birth'], ["can't be in the future"]
    assert_equal body['gender'], ["is not included in the list"]
    assert_equal body['phone_number'], ["is invalid"]
    assert_equal body['email'], ["is invalid"]
  end

  test "should destroy patient" do
    assert_difference("Patient.count", -1) do
      delete patient_url(@patient), as: :json
    end

    assert_response :no_content
  end
end
