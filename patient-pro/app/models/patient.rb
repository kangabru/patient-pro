class Patient < ApplicationRecord
  has_prefix_id :pat, fallback: false # https://github.com/excid3/prefixed_ids

  validates :first_name, presence: true
  validates :last_name, presence: true

  validates :date_of_birth, presence: true
  validate :date_is_in_the_past

  validates :gender, presence: true
  validates_inclusion_of :gender, in: ["male", "female", "other"]

  validates :phone_number, presence: false
  validates_format_of :phone_number, with: /[-x\d\s\+\(\)]+\z/, allow_blank: true

  validates :email, presence: false
  validates_format_of :email, with: /\A[^@\s]+@([^@\s]+\.)+[^@\s]+\z/, allow_blank: true

  def date_is_in_the_past
    errors.add(:date_of_birth, "can't be in the future") if date_of_birth.present? && date_of_birth > Date.today
  end

  def as_json(options={})
    super(options.merge({except: [:id], methods: [:prefix_id]}))
  end
end
