class PatientsController < ApplicationController
  before_action :set_patient, only: %i[ show update destroy ]

  # GET /patients
  def index
    @patients = Patient.all

    if params[:q]
      search_term = Patient.sanitize_sql_like(params[:q]).downcase + "%"
      @patients = Patient.order(created_at: :desc).where("lower(first_name) LIKE ? OR lower(last_name) LIKE ?", search_term, search_term)
    else
      @patients = Patient.order(created_at: :desc).all
    end

    render json: @patients
  end

  # GET /patients/1
  def show
    render json: @patient
  end

  # POST /patients
  def create
    @patient = Patient.new(patient_params)

    if @patient.save
      render json: @patient, status: :created, location: @patient
    else
      render json: @patient.errors, status: :unprocessable_entity
    end
  end

  # PATCH/PUT /patients/1
  def update
    if @patient.update(patient_params)
      render json: @patient
    else
      render json: @patient.errors, status: :unprocessable_entity
    end
  end

  # DELETE /patients/1
  def destroy
    @patient.destroy!
  end

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_patient
      @patient = Patient.find_by_prefix_id(params[:id])
      raise ActiveRecord::RecordNotFound if @patient.nil?
    end

    # Only allow a list of trusted parameters through.
    def patient_params
      params.require(:patient).permit(:first_name, :last_name, :date_of_birth, :gender, :phone_number, :email)
    end
end
