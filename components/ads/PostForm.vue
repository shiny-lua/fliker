<template>
  <div
    class="form-post px-md-3"
    :data-step="`step_${storeState.currentTab + 1}`"
    :class="{ form_submitted: step == 6 && form_submitted, loading: loading }"
  >
    <form-wizard
      @onNextStep="nextStep()"
      @onPreviousStep="previousStep()"
      @onComplete="submit()"
      previousButtonText="Back"
      nextButtonText="Next"
      submitButtonText="Submit"
    >
      <tab-content title="Select category" :selected="!action">
        <div class="form-content">
          <div class="fp-card fp-sm-no-card">
            <h6 class="text-md-center mb-3 mb-md-4">
              Post in<span class="rule">(Required)</span>
            </h6>
            <div class="category-container">
              <div
                class="category button-view fp-text-default"
                :class="{ active: item.id == formData.category_id }"
                v-for="(item, index) in categories"
                :key="index"
                @click="selectCategory(item)"
              >
                <fp-icon
                  :name="`ads-${item.slug}`"
                  class="fp-fs-22 d-block mx-auto mb-2"
                />
                {{ item.name }}
                <span v-if="item.price">({{ item.price_with_currency }})</span>
              </div>
            </div>
          </div>
          <div v-if="hasError('category')" class="text-danger">
            <div class="error" v-if="!$v.formData.category.required">
              Category is required
            </div>
          </div>
          <div class="fp-card fp-sm-no-card mt-4" v-if="sub_categories.length">
            <h6 class="text-md-center mb-2">
              Select your category<span class="rule">(Optional)</span>
            </h6>
            <p class="text-md-center mb-0 fp-text-active font-weight-400 mb-4">
              (* If no category is applicable, select NEXT)
            </p>
            <div class="d-flex flex-wrap sub-category-container">
              <div
                class="category button-view sub_category"
                :class="{
                  active: formData.sub_category_id == item.id,
                }"
                v-for="(item, index) in sub_categories"
                :key="index"
                @click="selectSubCategory(item)"
              >
                {{ item.name }}
              </div>
            </div>
          </div>
        </div>
      </tab-content>
      <tab-content title="Post details">
        <div class="form-content">
          <h4 class="text-underline text-center mb-4 d-md-none">
            Post details
          </h4>
          <div class="fp-card fp-sm-no-card">
            <div class="form-group">
              <label
                >Post subject or title <span class="text-danger">*</span></label
              >
              <input
                type="text"
                class="form-control"
                placeholder="Enter post subject"
                v-model="formData.title"
                maxlength="120"
              />
              <div v-if="hasError('title')" class="text-danger">
                <div class="error" v-if="!$v.formData.title.required">
                  The title is required
                </div>
              </div>
            </div>
            <div class="form-group mb-0">
              <label>Description</label>
              <textarea
                rows="8"
                class="form-control"
                v-model="formData.description"
                maxlength="100000"
                placeholder="Enter post details"
              ></textarea>
              <div class="text-right mt-1">
                <span class="fp-text-color-main"
                  >{{ description_chars }}/100000</span
                >
              </div>
            </div>
          </div>
        </div>
      </tab-content>
      <tab-content title="Other Details">
        <div class="row justify-content-center">
          <div class="col-md-12 col-lg-10 col-xl-9 px-2 px-md-3">
            <div class="fp-card fp-sm-no-card" v-if="selected_category">
              <div v-if="selected_category.name == 'Accommodation'">
                <h5 class="sub-title">Housing Details</h5>
                <div class="fp-border-color-1 p-3 border round-12 mb-4">
                  <div class="row mx-n2">
                    <div class="col-md-6 px-2 mb-4">
                      <label
                        >Accommodation Type
                        <span class="text-danger">*</span></label
                      >
                      <input
                        type="text"
                        class="form-control"
                        v-model="formData.house_type"
                        maxlength="50"
                        placeholder="Ex. Apartment or Condo"
                      />
                      <div v-if="hasError('house_type')" class="text-danger">
                        <div
                          class="error"
                          v-if="!$v.formData.house_type.required"
                        >
                          Accommodation type is required
                        </div>
                      </div>
                    </div>
                    <div class="col-md-6 px-2 mb-4">
                      <label>Bed Rooms#</label>
                      <input
                        type="text"
                        class="form-control"
                        v-model="formData.bed_rooms"
                        maxlength="15"
                        placeholder="Ex. 2 bed"
                      />
                    </div>
                    <div class="col-md-6 px-2 mb-4">
                      <label>Bath Rooms#</label>
                      <input
                        type="text"
                        class="form-control"
                        v-model="formData.bath_rooms"
                        maxlength="15"
                        placeholder="Ex. 2 bath"
                      />
                    </div>
                    <div class="col-md-6 px-2 mb-4">
                      <label>Furnished?</label>
                      <select
                        class="form-control has-bg"
                        v-model="formData.furnished"
                      >
                        <option value="" hidden>Select</option>
                        <option value="Semi-Furnished">Semi-Furnished</option>
                        <option value="Fully-Furnished">Fully-Furnished</option>
                        <option value="Not Furnished">Not Furnished</option>
                      </select>
                    </div>
                    <div class="col-md-6 px-2 mb-4">
                      <label for="">Property Area Size</label>
                      <input
                        type="text"
                        class="form-control"
                        v-model="formData.property_area"
                        placeholder="Ex. 1450 sq.ft"
                        maxlength="50"
                      />
                    </div>
                    <div class="col-md-6 px-2 mb-4">
                      <label>Rent+Utilities</label>
                      <div class="with-currency-unit with-currency with-unit">
                        <span class="symbol">$</span>
                        <input
                          v-model="formData.rent_other_utilities"
                          class="form-control"
                          oninput="javascript: if (this.value.length > this.maxLength) this.value = this.value.slice(0, this.maxLength);"
                          type="number"
                          placeholder="Ex. 2,100"
                          maxlength="7"
                        />
                        <select v-model="formData.rent_other_utilities_unit">
                          <option value="Day">Day</option>
                          <option value="Month">Month</option>
                          <option value="3 Months">3 Months</option>
                          <option value="6 Months">6 Months</option>
                          <option value="Year">Year</option>
                        </select>
                      </div>
                    </div>
                    <div class="col-md-6 px-2 mb-4">
                      <label>Available For</label>
                      <div class="pt-2">
                        <div
                          class="d-inline-flex custom-control custom-checkbox"
                        >
                          <input
                            v-model="formData.stay_available_for"
                            type="checkbox"
                            value="Any Stay"
                            class="custom-control-input"
                            id="stay_available_for_any_stay"
                          />
                          <label
                            class="custom-control-label"
                            for="stay_available_for_any_stay"
                            >Any Stay</label
                          >
                        </div>
                        <div
                          class="d-inline-flex custom-control custom-checkbox ml-3"
                        >
                          <input
                            v-model="formData.stay_available_for"
                            type="checkbox"
                            value="Long term"
                            class="custom-control-input"
                            id="stay_available_for_long_term"
                          />
                          <label
                            class="custom-control-label"
                            for="stay_available_for_long_term"
                            >Long term</label
                          >
                        </div>
                        <div
                          class="d-inline-flex custom-control custom-checkbox ml-3"
                        >
                          <input
                            v-model="formData.stay_available_for"
                            type="checkbox"
                            value="Short Term"
                            class="custom-control-input"
                            id="stay_available_for_short_term"
                          />
                          <label
                            class="custom-control-label"
                            for="stay_available_for_short_term"
                            >Short Term</label
                          >
                        </div>
                      </div>
                    </div>
                    <div class="col-md-6 px-2 mb-4">
                      <label for="">Available From</label>
                      <datepicker
                        v-model="formData.available_from"
                        :disabled-dates="{ to: new Date() }"
                        input-class="form-control"
                        placeholder="Ex. 08/22/2022"
                        format="MM/dd/yyyy"
                        :disabled="formData.available_from_today"
                      ></datepicker>
                      <div class="custom-control custom-checkbox mt-2">
                        <input
                          type="checkbox"
                          class="custom-control-input"
                          id="available_from_today"
                          @change="availableFromToday"
                        />
                        <label
                          class="custom-control-label"
                          for="available_from_today"
                          >Available from today</label
                        >
                      </div>
                    </div>
                    <div class="col-md-6 px-2 mb-4 mb-md-0">
                      <label>Smoking Allowed</label>
                      <div class="pt-2">
                        <div class="d-inline-flex custom-control custom-radio">
                          <input
                            v-model="formData.smoking_allowed"
                            type="radio"
                            class="custom-control-input"
                            id="smoking_allowed_yes"
                            name="smoking_allowed"
                            value="Yes"
                          />
                          <label
                            class="custom-control-label"
                            for="smoking_allowed_yes"
                            >Yes</label
                          >
                        </div>
                        <div
                          class="d-inline-flex ml-3 custom-control custom-radio"
                        >
                          <input
                            v-model="formData.smoking_allowed"
                            type="radio"
                            class="custom-control-input"
                            id="smoking_allowed_no"
                            name="smoking_allowed"
                            value="No"
                          />
                          <label
                            class="custom-control-label"
                            for="smoking_allowed_no"
                            >No</label
                          >
                        </div>
                        <div
                          class="d-inline-flex ml-3 custom-control custom-radio"
                        >
                          <input
                            v-model="formData.smoking_allowed"
                            type="radio"
                            class="custom-control-input"
                            id="smoking_allowed_outside_only"
                            name="smoking_allowed"
                            value="Outside only"
                          />
                          <label
                            class="custom-control-label"
                            for="smoking_allowed_outside_only"
                            >Outside only</label
                          >
                        </div>
                      </div>
                    </div>
                    <div class="col-md-6 px-2">
                      <label>Pets Allowed</label>
                      <div class="pt-2">
                        <div class="d-inline-flex custom-control custom-radio">
                          <input
                            v-model="formData.pets_allowed"
                            type="radio"
                            class="custom-control-input"
                            id="pets_allowed_yes"
                            name="pets_allowed"
                            value="Yes"
                          />
                          <label
                            class="custom-control-label"
                            for="pets_allowed_yes"
                            >Yes</label
                          >
                        </div>
                        <div
                          class="d-inline-flex ml-3 custom-control custom-radio"
                        >
                          <input
                            v-model="formData.pets_allowed"
                            type="radio"
                            class="custom-control-input"
                            id="pets_allowed_no"
                            name="pets_allowed"
                            value="No"
                          />
                          <label
                            class="custom-control-label"
                            for="pets_allowed_no"
                            >No</label
                          >
                        </div>
                      </div>
                      <input
                        v-if="formData.pets_allowed === 'Yes'"
                        type="text"
                        class="form-control mt-2"
                        v-model="formData.pet_characteristics"
                        maxlength="100"
                        placeholder="Ex. Cats are ok - purr"
                      />
                    </div>
                  </div>
                </div>
                <h5 class="sub-title">Additional Info</h5>
                <div class="fp-border-color-1 p-3 border round-12">
                  <div class="row mx-n2">
                    <div class="col-md-6 px-2 mb-4 mb-md-0">
                      <label>Near by Places</label>
                      <div>
                        <form
                          action=""
                          class="d-flex"
                          @submit.prevent="addProperty"
                        >
                          <input
                            type="text"
                            class="form-control flex-grow-1"
                            ref="property_form"
                            placeholder="Ex. Airport - 5 miles"
                            maxlength="50"
                            required
                          />
                          <button
                            type="submit"
                            class="btn fp-btn-gradient ml-2 cus-btn"
                          >
                            <fa icon="plus" />&nbsp;Add
                          </button>
                        </form>
                        <div
                          class="flex-wrap mt-2"
                          style="flex-direction: row"
                          v-show="formData.accommodation_properties.length"
                        >
                          <span
                            class="information-item"
                            v-for="(
                              item, index
                            ) in formData.accommodation_properties"
                            :key="index"
                          >
                            {{ item }}
                            <fa
                              icon="times"
                              class="btn-remove"
                              @click="removeProperty(index)"
                            />
                          </span>
                        </div>
                      </div>
                    </div>
                    <div class="col-md-6 px-2">
                      <label>Property Amenities</label>
                      <div class="">
                        <form
                          action=""
                          class="d-flex"
                          @submit.prevent="addAmenity"
                        >
                          <input
                            type="text"
                            class="form-control flex-grow-1"
                            ref="amenity_form"
                            maxlength="50"
                            placeholder="Ex. Playground"
                            required
                          />
                          <button
                            type="submit"
                            class="btn fp-btn-gradient ml-2 cus-btn"
                          >
                            <fa icon="plus" />&nbsp;Add
                          </button>
                        </form>
                        <div
                          class="flex-wrap mt-2"
                          style="flex-direction: row"
                          v-show="formData.accommodation_amenities.length"
                        >
                          <span
                            class="information-item"
                            v-for="(
                              item, index
                            ) in formData.accommodation_amenities"
                            :key="index"
                          >
                            {{ item }}
                            <fa
                              icon="times"
                              class="btn-remove"
                              @click="removeAmenity(item)"
                            />
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div v-else-if="selected_category.name == 'Jobs'">
                <h5 class="sub-title">Key Details</h5>
                <div class="fp-border-color-1 p-3 border round-12 mb-4">
                  <div class="row mx-n2">
                    <div class="col-md-6 px-2 mb-4">
                      <label
                        >Job title <span class="text-danger">*</span></label
                      >
                      <input
                        type="text"
                        class="form-control"
                        v-model="formData.job_title"
                        maxlength="50"
                        placeholder="Ex. Marketing manager"
                      />
                      <div v-if="hasError('job_title')" class="text-danger">
                        <div
                          class="error"
                          v-if="!$v.formData.job_title.required"
                        >
                          Job title is required
                        </div>
                      </div>
                    </div>
                    <div class="col-md-6 px-2 mb-4">
                      <label>Client or recruiter</label>
                      <input
                        type="text"
                        class="form-control"
                        v-model="formData.client_recruiter"
                        maxlength="50"
                        placeholder="Ex. RGroup Solutions LLC, AZ"
                      />
                    </div>
                    <div class="col-md-6 px-2 mb-4">
                      <label>Employment type</label>
                      <multiselect
                        v-model="formData.employement_types"
                        :options="employement_types"
                        :preserve-search="true"
                        :multiple="true"
                        placeholder="Select option"
                        :show-labels="false"
                      ></multiselect>
                    </div>
                    <div class="col-md-6 px-2 mb-4">
                      <label>Compensation or salary</label>
                      <div class="with-currency-unit with-currency with-unit">
                        <span class="symbol">$</span>
                        <input
                          v-model="formData.compensation"
                          class="form-control"
                          oninput="javascript: if (this.value.length > this.maxLength) this.value = this.value.slice(0, this.maxLength);"
                          type="number"
                          placeholder="Ex. 65,000"
                          maxlength="9"
                        />
                        <select v-model="formData.compensation_unit">
                          <option value="Hour">\Hr</option>
                          <option value="Day">\Day</option>
                          <option value="Weekly">\Weekly</option>
                          <option value="Biweekly">\Biweekly</option>
                          <option value="Month">\Month</option>
                          <option value="Year">\Year</option>
                        </select>
                      </div>
                    </div>
                    <div class="col-md-6 px-2 mb-4 mb-md-0">
                      <label>Interview mode</label>
                      <input
                        type="text"
                        class="form-control"
                        v-model="formData.interview_mode"
                        maxlength="50"
                        placeholder="Ex. Telephonic + WebEx"
                      />
                    </div>
                    <div class="col-md-6 px-2">
                      <label>Remote or work from home available?</label>
                      <select
                        v-model="formData.remote_work_from_home"
                        class="form-control has-bg"
                      >
                        <option value="" hidden>Select</option>
                        <option value="No">No</option>
                        <option value="Yes">Yes</option>
                        <option value="After few months">
                          After few months
                        </option>
                      </select>
                    </div>
                  </div>
                </div>
                <h5 class="sub-title">Benefits</h5>
                <div class="fp-border-color-1 px-3 pt-3 border round-12 mb-4">
                  <div>
                    <div
                      v-for="(item, index) in benefits"
                      :key="index"
                      class="d-inline-flex custom-control custom-checkbox mb-3 mr-3"
                    >
                      <input
                        v-model="formData.benefits"
                        type="checkbox"
                        :value="item"
                        class="custom-control-input"
                        :id="`jobs_benefits_${index}`"
                      />
                      <label
                        class="custom-control-label"
                        :for="`jobs_benefits_${index}`"
                        >{{ item }}</label
                      >
                    </div>
                    <form class="add-benefit-form" @submit.prevent="addBenefit">
                      <input
                        type="text"
                        class="form-control"
                        ref="benefit_form"
                        maxlength="30"
                        required
                        placeholder="Ex. Retirement benefits"
                      />
                      <button type="submit" class="btn fp-btn-gradient ml-1 cus-btn">
                        Add
                      </button>
                    </form>
                  </div>
                </div>
                <h5 class="sub-title">Work authorization required</h5>
                <div class="fp-border-color-1 px-3 pt-3 border round-12 mb-4">
                  <div>
                    <div
                      v-for="(item, index) in work_authorizations"
                      :key="index"
                      class="d-inline-flex custom-control custom-checkbox mb-3 mr-3"
                    >
                      <input
                        v-model="formData.work_authorizations"
                        type="checkbox"
                        :value="item"
                        class="custom-control-input"
                        :id="`work_authorizations_${index}`"
                      />
                      <label
                        class="custom-control-label"
                        :for="`work_authorizations_${index}`"
                        >{{ item }}</label
                      >
                    </div>
                  </div>
                </div>
                <div class="options">
                  <div class="custom-control custom-checkbox mb-3">
                    <input
                      v-model="formData.job_options"
                      type="checkbox"
                      value="EOE"
                      class="custom-control-input"
                      id="job_options_eoe"
                    />
                    <label class="custom-control-label" for="job_options_eoe"
                      >We are e-verified and Equal Opportunity
                      Employer(EOE)</label
                    >
                  </div>
                  <div class="custom-control custom-checkbox mb-3">
                    <input
                      v-model="formData.job_options"
                      type="checkbox"
                      value="Invite"
                      class="custom-control-input"
                      id="job_options_invite"
                    />
                    <label class="custom-control-label" for="job_options_invite"
                      >Invite people with disabilities for this position</label
                    >
                  </div>
                  <div class="custom-control custom-checkbox mb-3">
                    <input
                      v-model="formData.job_options"
                      type="checkbox"
                      value="VISA"
                      class="custom-control-input"
                      id="job_options_visa"
                    />
                    <label class="custom-control-label" for="job_options_visa"
                      >Work visa sponsership available for this position</label
                    >
                  </div>
                  <div class="custom-control custom-checkbox">
                    <input
                      v-model="formData.job_options"
                      type="checkbox"
                      value="Direct"
                      class="custom-control-input"
                      id="job_options_direct"
                    />
                    <label class="custom-control-label" for="job_options_direct"
                      >Direct applicants only. No third party recruiters allowed
                      apply.</label
                    >
                  </div>
                </div>
              </div>

              <div v-else-if="selected_category.name == 'For Sale'">
                <div class="row mx-n2">
                  <div class="col-md-6 px-2 mb-4">
                    <label
                      >Item for sale <span class="text-danger">*</span></label
                    >
                    <input
                      type="text"
                      v-model="formData.job_title"
                      class="form-control"
                      maxlength="50"
                      placeholder="Ex. Macbook pro"
                      required
                    />
                    <div v-if="hasError('job_title')" class="text-danger">
                      <div class="error" v-if="!$v.formData.job_title.required">
                        The item name is required
                      </div>
                    </div>
                  </div>
                  <div class="col-md-6 px-2 mb-4">
                    <label>Sale by</label>
                    <select
                      v-model="formData.sale_by"
                      class="form-control has-bg"
                    >
                      <option value="" hidden>Select</option>
                      <option value="Individual/Owner">Individual/Owner</option>
                      <option value="Local Store">Local Store</option>
                      <option value="Dealer">Dealer</option>
                      <option value="Wholesale Market">Wholesale Market</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                  <div class="col-md-6 px-2 mb-4">
                    <label>Condition</label>
                    <select
                      v-model="formData.condition"
                      class="form-control has-bg"
                    >
                      <option value="" hidden>Select</option>
                      <option value="New">New</option>
                      <option value="Excellent">Excellent</option>
                      <option value="Good">Good</option>
                      <option value="Average">Average</option>
                      <option value="Like New">Like New</option>
                      <option value="Open Box">Open Box</option>
                    </select>
                  </div>
                  <div class="col-md-6 px-2">
                    <label>Asking price</label>
                    <div class="with-currency-unit with-currency">
                      <span class="symbol">$</span>
                      <input
                        v-model="formData.cost"
                        class="form-control"
                        oninput="javascript: if (this.value.length > this.maxLength) this.value = this.value.slice(0, this.maxLength);"
                        type="number"
                        placeholder="Ex. 1,050"
                        maxlength="10"
                      />
                    </div>
                  </div>
                  <div class="col-md-6 px-2 mb-4">
                    <label>Make</label>
                    <input
                      type="text"
                      v-model="formData.manufacturer"
                      class="form-control"
                      maxlength="50"
                      placeholder="Enter Manufacturer"
                    />
                  </div>
                  <div class="col-md-6 px-2 mb-4">
                    <label>Model</label>
                    <input
                      type="text"
                      v-model="formData.model"
                      class="form-control"
                      maxlength="50"
                      placeholder="Model or Serial Number"
                    />
                  </div>
                  <div class="col-12 px-2">
                    <label>Additional Info</label>
                    <textarea
                      v-model="formData.business_hours"
                      rows="3"
                      class="form-control"
                      maxlength="500"
                      placeholder="Enter details here..."
                    ></textarea>
                    <p class="text-right fp-text-color-main mb-0">
                      {{
                        formData.business_hours
                          ? formData.business_hours.length
                          : 0
                      }}/ 500
                    </p>
                  </div>
                </div>
              </div>

              <div v-else-if="selected_category.name == 'Training/Lessons'">
                <div class="row mx-n2">
                  <div class="col-md-6 px-2 mb-4">
                    <label>Trainer or institute</label>
                    <input
                      type="text"
                      class="form-control"
                      v-model="formData.trainer_institute"
                      maxlength="50"
                      placeholder="Ex. ABC institute"
                    />
                  </div>
                  <div class="col-md-6 px-2 mb-4">
                    <label>Training offered</label>
                    <form class="d-flex" @submit.prevent="addTrainingCourse">
                      <input
                        type="text"
                        class="form-control flex-grow-1"
                        ref="training_course_form"
                        maxlength="50"
                        placeholder="Ex. Spanish classes"
                      />
                      <button type="submit" class="btn fp-btn-gradient ml-2 cus-btn">
                        <fa icon="plus" />&nbsp;Add
                      </button>
                    </form>
                  </div>
                  <div
                    v-show="formData.training_courses.length"
                    class="col-12 px-2 mb-4"
                  >
                    <div class="flex-wrap" style="flex-direction: row">
                      <span
                        class="information-item"
                        v-for="(item, index) in formData.training_courses"
                        :key="index"
                      >
                        {{ item }}
                        <fa
                          icon="times"
                          class="btn-remove"
                          @click="removeTrainingCourse(index)"
                        />
                      </span>
                    </div>
                  </div>
                  <div class="col-12 px-2 mb-4">
                    <label>Training mode</label>
                    <div>
                      <div
                        class="d-inline-flex custom-control custom-checkbox mr-3"
                      >
                        <input
                          v-model="formData.training_modes"
                          type="checkbox"
                          value="Online"
                          class="custom-control-input"
                          id="training_modes_online"
                        />
                        <label
                          class="custom-control-label"
                          for="training_modes_online"
                          >Online</label
                        >
                      </div>
                      <div
                        class="d-inline-flex custom-control custom-checkbox mr-3"
                      >
                        <input
                          v-model="formData.training_modes"
                          type="checkbox"
                          value="Onsite"
                          class="custom-control-input"
                          id="training_modes_onsite"
                        />
                        <label
                          class="custom-control-label"
                          for="training_modes_onsite"
                          >Onsite</label
                        >
                      </div>
                      <div
                        class="d-inline-flex custom-control custom-checkbox mr-3"
                      >
                        <input
                          v-model="formData.training_modes"
                          type="checkbox"
                          value="Hybrid"
                          class="custom-control-input"
                          id="training_modes_hybrid"
                        />
                        <label
                          class="custom-control-label"
                          for="training_modes_hybrid"
                          >Hybrid</label
                        >
                      </div>
                      <div class="d-inline-flex custom-control custom-checkbox">
                        <input
                          v-model="formData.training_modes"
                          type="checkbox"
                          value="Trainee preferred"
                          class="custom-control-input"
                          id="training_modes_trainee_preferred"
                        />
                        <label
                          class="custom-control-label"
                          for="training_modes_trainee_preferred"
                          >Trainee preferred</label
                        >
                      </div>
                    </div>
                  </div>
                  <div class="col-md-6 px-2 mb-4 mb-md-0">
                    <label>Training or course fee</label>
                    <textarea
                      class="form-control"
                      rows="3"
                      v-model="formData.training_fee"
                      placeholder="Explain fee details..."
                      maxlength="500"
                    />
                    <p class="text-right text-muted mb-0">
                      {{
                        formData.training_fee
                          ? formData.training_fee.length
                          : 0
                      }}/ 500
                    </p>
                  </div>
                  <div class="col-md-6 px-2">
                    <label>Open Hours</label>
                    <textarea
                      class="form-control"
                      rows="3"
                      v-model="formData.business_hours"
                      placeholder="Explain open hours..."
                      maxlength="80"
                    />
                  </div>
                </div>
              </div>

              <div v-else-if="selected_category.name == 'Real Estate'">
                <h5 class="sub-title">
                  Property Details <span class="text-danger">*</span>
                </h5>
                <div class="fp-border-color-1 p-3 border round-12">
                  <div class="row mx-n2">
                    <div class="col-md-6 px-2 mb-4">
                      <label>Property Type</label>
                      <input
                        type="text"
                        class="form-control"
                        v-model="formData.house_type"
                        maxlength="50"
                        placeholder="Ex. Apt or Commercial Land"
                      />
                      <div v-if="hasError('house_type')" class="text-danger">
                        <div
                          class="error"
                          v-if="!$v.formData.house_type.required"
                        >
                          Property type is required
                        </div>
                      </div>
                    </div>
                    <div class="col-md-6 px-2 mb-4">
                      <label>Property Area Size</label>
                      <div class="with-currency-unit with-unit">
                        <input
                          v-model="formData.property_area"
                          class="form-control"
                          oninput="javascript: if (this.value.length > this.maxLength) this.value = this.value.slice(0, this.maxLength);"
                          type="number"
                          placeholder="Ex. 5,400"
                          maxlength="10"
                        />
                        <select v-model="formData.property_area_unit">
                          <option value="Sq.ft">Sq.ft</option>
                          <option value="Sq.yd">Sq.yd</option>
                          <option value="Sq.mt">Sq.mt</option>
                          <option value="Acer">Acer</option>
                          <option value="Hector">Hector</option>
                        </select>
                      </div>
                      <div v-if="hasError('property_area')" class="text-danger">
                        <div
                          class="error"
                          v-if="!$v.formData.property_area.required"
                        >
                          Property area size is required
                        </div>
                      </div>
                    </div>
                    <template
                      v-if="
                        selected_sub_category &&
                        [
                          'Single/Multi-Family Homes',
                          'Independent House/ Villas',
                          'Swap Properties',
                          'Condos/ Townhouse/ Studios',
                          'Bank/Foreclosures',
                          'Government/Auction',
                          'New/Upcoming',
                        ].includes(selected_sub_category.name)
                      "
                    >
                      <div class="col-md-6 px-2 mb-4">
                        <label>Furnished?</label>
                        <select
                          class="form-control has-bg"
                          v-model="formData.furnished"
                        >
                          <option value="" hidden>Select</option>
                          <option value="Semi-Furnished">Semi-Furnished</option>
                          <option value="Fully-Furnished">
                            Fully-Furnished
                          </option>
                          <option value="Not Furnished">Not Furnished</option>
                        </select>
                      </div>
                      <div class="col-md-6 px-2 mb-4">
                        <label>No.of Beds/Baths</label>
                        <input
                          type="text"
                          class="form-control"
                          v-model="formData.bed_rooms"
                          maxlength="20"
                          placeholder="Ex. 2-bed/ 3-bath"
                        />
                      </div>
                    </template>
                    <div class="col-md-6 px-2">
                      <label>Estimated/Selling price</label>
                      <div class="with-currency-unit with-currency">
                        <span class="symbol">$</span>
                        <input
                          v-model="formData.cost"
                          class="form-control"
                          oninput="javascript: if (this.value.length > this.maxLength) this.value = this.value.slice(0, this.maxLength);"
                          type="number"
                          placeholder="Enter best selling price"
                          maxlength="10"
                        />
                      </div>
                      <div v-if="hasError('cost')" class="text-danger">
                        <div class="error" v-if="!$v.formData.cost.required">
                          Price is required
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <h5 class="sub-title mt-3 mt-md-4">Additional Info</h5>
                <div class="fp-border-color-1 p-3 border round-12">
                  <div class="row mx-n2">
                    <div class="col-md-6 px-2 mb-4 mb-md-0">
                      <label>Near by places</label>
                      <div>
                        <form class="d-flex" @submit.prevent="addProperty">
                          <input
                            type="text"
                            class="form-control flex-grow-1"
                            ref="property_form"
                            placeholder="Ex. Airport - 5 miles"
                            maxlength="50"
                            required
                          />
                          <button
                            type="submit"
                            class="btn fp-btn-gradient ml-2 cus-btn no-wrap"
                          >
                            <fa icon="plus" />&nbsp;Add
                          </button>
                        </form>
                        <div
                          class="flex-wrap mt-2"
                          style="flex-direction: row"
                          v-show="formData.accommodation_properties.length"
                        >
                          <span
                            class="information-item"
                            v-for="(
                              item, index
                            ) in formData.accommodation_properties"
                            :key="index"
                          >
                            {{ item }}
                            <fa
                              icon="times"
                              class="btn-remove"
                              @click="removeProperty(index)"
                            />
                          </span>
                        </div>
                      </div>
                    </div>
                    <div class="col-md-6 px-2">
                      <label>Amenities/Features</label>
                      <div>
                        <form class="d-flex" @submit.prevent="addAmenity">
                          <input
                            type="text"
                            class="form-control flex-grow-1"
                            ref="amenity_form"
                            maxlength="50"
                            placeholder="Ex. Playground"
                            required
                          />
                          <button
                            type="submit"
                            class="btn fp-btn-gradient ml-2 cus-btn"
                          >
                            <fa icon="plus" />&nbsp;Add
                          </button>
                        </form>
                        <div
                          class="flex-wrap mt-2"
                          style="flex-direction: row"
                          v-show="formData.accommodation_amenities.length"
                        >
                          <span
                            class="information-item"
                            v-for="(
                              item, index
                            ) in formData.accommodation_amenities"
                            :key="index"
                          >
                            {{ item }}
                            <fa
                              icon="times"
                              class="btn-remove"
                              @click="removeAmenity(item)"
                            />
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <h5 class="sub-title mt-3 mt-md-4">Realtor Details</h5>
                <div class="fp-border-color-1 p-3 border round-12">
                  <div class="row mx-n2">
                    <div class="col-md-6 px-2 mb-4">
                      <label>Realtor</label>
                      <input
                        type="text"
                        class="form-control"
                        v-model="formData.realtor"
                        placeholder="Ex. Business/Realtor name"
                        maxlength="40"
                      />
                    </div>
                    <div class="col-md-6 px-2 mb-4">
                      <label>License#</label>
                      <input
                        type="text"
                        class="form-control"
                        v-model="formData.license"
                        placeholder="Ex. XX-0000-XX"
                        maxlength="20"
                      />
                    </div>
                    <div class="col-12 px-2 mb-4">
                      <label>Business Location</label>
                      <div class="fp-border-color-1 p-3 border round-12">
                        <div class="row mx-n2">
                          <div class="col-12 mb-2">
                            <label>Street Address</label>
                            <gmap-autocomplete
                              :value="formData.business_address"
                              class="form-control w-100"
                              @place_changed="updateBusinessAddress"
                              placeholder="Enter street address"
                              style="max-width: 100%"
                              @keypress.enter="$event.preventDefault()"
                              :options="gmapAutocompleteOptions"
                            ></gmap-autocomplete>
                          </div>
                          <div class="col-md-4 px-n2 mb-3 mb-md-0">
                            <label>Zip Code</label>
                            <gmap-autocomplete
                              class="form-control w-100"
                              :value="formData.business_zipcode"
                              @place_changed="updateBusinessAddress"
                              @input="
                                formData.business_zipcode = $event.target.value
                              "
                              placeholder="Zip"
                              style="max-width: 100%"
                              @keypress.enter="$event.preventDefault()"
                              :options="gmapAutocompleteOptions"
                            ></gmap-autocomplete>
                          </div>
                          <div class="col-md-4 px-n2 mb-3 mb-md-0">
                            <label>City</label>
                            <input
                              type="text"
                              class="form-control"
                              v-model="formData.business_city"
                              placeholder="City"
                              readonly
                            />
                          </div>
                          <div class="col-md-4 px-n2 mb-3 mb-md-0">
                            <label>State</label>
                            <input
                              type="text"
                              class="form-control"
                              v-model="formData.business_state"
                              placeholder="State"
                              readonly
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                    <div class="col-md-12 px-2 mb-4">
                      <label>Services provide in</label>
                      <div>
                        <gmap-autocomplete
                          class="form-control w-100"
                          :value="location_form.value"
                          @place_changed="addLocation"
                          placeholder="Select State"
                          style="max-width: 100%"
                          @keypress.enter="$event.preventDefault()"
                          :options="gmapAutocompleteOptions"
                        ></gmap-autocomplete>
                      </div>
                      <div
                        class="flex-wrap mt-2"
                        style="flex-direction: row"
                        v-show="formData.locations.length"
                      >
                        <span
                          class="information-item"
                          v-for="(item, index) in formData.locations"
                          :key="index"
                        >
                          {{ item }}
                          <fa
                            icon="times"
                            class="btn-remove"
                            @click="removeLocation(item)"
                          />
                        </span>
                      </div>
                    </div>
                    <div class="col-md-12 px-2">
                      <label>Hours of Operation</label>
                      <textarea
                        rows="3"
                        class="form-control"
                        placeholder="Enter business hours"
                        v-model="formData.business_hours"
                        maxlength="60"
                      ></textarea>
                    </div>
                  </div>
                </div>
              </div>

              <div v-else-if="selected_category.name === 'Rent/Lease'">
                <div class="row mx-n2">
                  <div class="col-md-6 px-2 mb-4">
                    <label>Property or item</label>
                    <div class="with-currency-unit with-unit">
                      <input
                        type="text"
                        class="form-control"
                        v-model="formData.rent_lease_item"
                        maxlength="50"
                        placeholder="Ex. Office space"
                        style="padding-right: 90px"
                      />
                      <select v-model="formData.rent_lease_unit">
                        <option value="for rent">For Rent</option>
                        <option value="for lease">For Lease</option>
                      </select>
                    </div>
                  </div>
                  <div class="col-md-6 px-2 mb-4">
                    <label>Rent or lease cost</label>
                    <div class="with-currency-unit with-currency with-unit">
                      <span class="symbol">$</span>
                      <input
                        v-model="formData.rent_lease_cost"
                        class="form-control"
                        oninput="javascript: if (this.value.length > this.maxLength) this.value = this.value.slice(0, this.maxLength);"
                        type="number"
                        placeholder="Ex. 1,200"
                        maxlength="9"
                      />
                      <select v-model="formData.cost_unit">
                        <option value="Day">\Day</option>
                        <option value="Week">\Week</option>
                        <option value="Month">\Month</option>
                        <option value="6-Month">\6-Month</option>
                        <option value="Year">\Year</option>
                      </select>
                    </div>
                  </div>
                  <div class="col-md-6 px-2 mb-4">
                    <label>Terms or duration</label>
                    <textarea
                      class="form-control"
                      rows="3"
                      v-model="formData.rent_lease_term"
                      maxlength="500"
                      placeholder="Explain term/ duration..."
                    />
                    <p class="text-right fp-text-color-main mb-0">
                      {{
                        formData.rent_lease_term
                          ? formData.rent_lease_term.length
                          : 0
                      }}/ 500
                    </p>
                  </div>
                </div>
              </div>

              <div v-else-if="selected_category.name == 'Community'">
                <div class="form-group mb-0">
                  <label>Quick Comments</label>
                  <textarea
                    class="form-control"
                    rows="3"
                    v-model="formData.business_hours"
                    maxlength="500"
                    placeholder="Enter key details in few words..."
                  />
                  <p class="text-right text-muted mb-0">
                    {{
                      formData.business_hours
                        ? formData.business_hours.length
                        : 0
                    }}/ 500
                  </p>
                </div>
              </div>

              <div
                v-else-if="
                  selected_category.name === 'Pets' &&
                  selected_sub_category &&
                  selected_sub_category.name === 'Pet Adoption'
                "
              >
                <div class="row mx-n2">
                  <div class="col-lg-6 px-2 mb-4">
                    <label>Breed/Species</label>
                    <input
                      type="text"
                      class="form-control"
                      v-model="formData.breed_species_type"
                      placeholder="Ex. Papillon"
                      maxlength="50"
                    />
                  </div>
                  <div class="col-lg-6 px-2 mb-4">
                    <label>Pet Age</label>
                    <input
                      type="text"
                      class="form-control"
                      v-model="formData.pet_age"
                      placeholder="Ex. 3 years"
                      maxlength="40"
                    />
                  </div>
                  <div class="col-lg-6 px-2 mb-4">
                    <label>Color</label>
                    <input
                      type="text"
                      class="form-control"
                      v-model="formData.pet_color"
                      placeholder="Ex. Gold/White"
                      maxlength="40"
                    />
                  </div>
                  <div class="col-lg-6 px-2 mb-4">
                    <label>Sex</label>
                    <input
                      type="text"
                      class="form-control"
                      v-model="formData.pet_sex"
                      placeholder="Ex. Male"
                      maxlength="40"
                    />
                  </div>
                  <div class="col-lg-6 px-2 mb-4">
                    <label>Size/Weight</label>
                    <input
                      type="text"
                      class="form-control"
                      v-model="formData.pet_size_weight"
                      placeholder="Ex. 4.5lbs"
                      maxlength="40"
                    />
                  </div>
                  <div class="col-lg-6 px-2 mb-4">
                    <label>Characteristics</label>
                    <input
                      type="text"
                      class="form-control"
                      v-model="formData.pet_characteristics"
                      placeholder="Ex. Friendly, Calm"
                      maxlength="100"
                    />
                  </div>
                  <div class="col-12 px-2">
                    <label>Additional Info</label>
                    <textarea
                      rows="3"
                      class="form-control"
                      v-model="formData.business_hours"
                      placeholder="Explain any other details..."
                      maxlength="200"
                    ></textarea>
                  </div>
                </div>
              </div>
              <div
                v-else-if="
                  selected_category.name === 'Pets' &&
                  selected_sub_category &&
                  selected_sub_category.name === 'Pet Accessories'
                "
              >
                <div class="row mx-n2">
                  <div class="col-md-6 px-2 mb-4">
                    <label>Item/Accessory for sale</label>
                    <input
                      type="text"
                      class="form-control"
                      v-model="formData.job_title"
                      placeholder="Ex. Neck belt"
                      maxlength="50"
                    />
                  </div>
                  <div class="col-md-6 px-2 mb-4">
                    <label>Sale by</label>
                    <select
                      class="form-control has-bg"
                      v-model="formData.sale_by"
                    >
                      <option value="" hidden>Select</option>
                      <option value="Individual/Owner">Individual/Owner</option>
                      <option value="Local Store">Local Store</option>
                      <option value="Dealer">Dealer</option>
                      <option value="Wholesale Market">Wholesale Market</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                  <div class="col-md-6 px-2 mb-4">
                    <label>Condition</label>
                    <select
                      class="form-control has-bg"
                      v-model="formData.condition"
                    >
                      <option value="" hidden>Select</option>
                      <option value="New">New</option>
                      <option value="Excellent">Excellent</option>
                      <option value="Good">Good</option>
                      <option value="Average">Average</option>
                      <option value="Below Average">Below Average</option>
                      <option value="Like New">Like New</option>
                      <option value="Open Box">Open Box</option>
                    </select>
                  </div>
                  <div class="col-md-6 px-2 mb-4">
                    <label>Asking price</label>
                    <input
                      type="text"
                      class="form-control"
                      v-model="formData.cost"
                      placeholder="Ex. 25$/item"
                      maxlength="40"
                    />
                  </div>
                  <div class="col-12 px-2">
                    <label>Additional Info</label>
                    <textarea
                      class="form-control"
                      rows="5"
                      v-model="formData.business_hours"
                      placeholder="Any other details..."
                      maxlength="200"
                    />
                  </div>
                </div>
              </div>

              <!-- Local Services, Repairs, Pet Services  -->
              <div v-else>
                <div class="row mx-n2">
                  <div class="col-md-6 px-2">
                    <div class="form-group">
                      <label>
                        <span v-if="selected_category.name === 'Legal/Lawyers'"
                          >Legal firm or lawyer name</span
                        >
                        <span
                          v-else-if="
                            selected_category.name === 'Gigs/Freelancers'
                          "
                          >Freelancer/ Service provider</span
                        >
                        <span
                          v-else-if="
                            selected_category.name === 'Pets' &&
                            selected_sub_category &&
                            selected_sub_category.name === 'Pet Care'
                          "
                          >Business or care provider</span
                        >
                        <span v-else>Business or your name</span>
                      </label>
                      <input
                        type="text"
                        class="form-control"
                        v-model="formData.service_provider"
                        :placeholder="placeholder_service_provider"
                        :maxlength="max_length_service_provider"
                      />
                    </div>
                    <div
                      class="form-group mb-md-0"
                      :class="
                        'pt-md-2' &&
                        selected_category.name !== 'Legal/Lawyers' &&
                        selected_category.name !== 'Skilled Trades'
                      "
                    >
                      <label>List of Services</label>
                      <div>
                        <form class="d-flex" @submit.prevent="addService()">
                          <input
                            type="text"
                            class="form-control flex-grow-1"
                            ref="service_form"
                            :placeholder="placeholder_list_of_services"
                            required
                            :maxlength="
                              selected_category.name === 'Legal/Lawyers'
                                ? 50
                                : 40
                            "
                          />
                          <button
                            type="submit"
                            class="btn fp-btn-gradient ml-2 cus-btn"
                          >
                            <fa icon="plus" /> Add
                          </button>
                        </form>
                        <div
                          class="flex-wrap d-md-none"
                          v-show="formData.services.length"
                        >
                          <span
                            class="information-item"
                            v-for="(item, index) in formData.services"
                            :key="index"
                          >
                            {{ item }}
                            <fa
                              icon="times"
                              class="btn-remove"
                              @click="removeService(item)"
                            />
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div class="col-md-6 px-2">
                    <div
                      v-if="
                        selected_category.name === 'Legal/Lawyers' ||
                        selected_category.name === 'Skilled Trades'
                      "
                      class="form-group"
                    >
                      <label> License Info </label>
                      <input
                        type="text"
                        class="form-control"
                        v-model="formData.license"
                        placeholder="Ex. #2563A01"
                        :maxlength="max_length_list_of_services"
                      />
                    </div>
                    <div class="form-group mb-0">
                      <label>
                        <span
                          v-if="selected_category.name === 'Gigs/Freelancers'"
                          >Working Hours</span
                        >
                        <span v-else>Open hours</span>
                      </label>

                      <!-- <p>{{`timings are${formData.fromavailable} to ${formData.toavailable}`  }}</p> -->
                      <textarea
                        rows="5"
                        class="form-control"
                        :placeholder="placeholder_hours_of_operation"
                        v-model="formData.business_hours"
                        maxlength="80"
                      ></textarea>
                    </div>
                  </div>
                  <div
                    class="flex-wrap d-none d-md-flex mt-2"
                    v-show="formData.services.length"
                  >
                    <span
                      class="information-item"
                      v-for="(item, index) in formData.services"
                      :key="index"
                    >
                      {{ item }}
                      <fa
                        icon="times"
                        class="btn-remove"
                        @click="removeService(item)"
                      />
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </tab-content>
      <tab-content title="Gallery">
        <div class="row justify-content-center">
          <div class="col-lg-9">
            <fp-uploader
              :url="uploadImageUrl"
              :remove-url="removeImageUrl"
              v-model="formData.images"
              @removed="imageRemoved"
            />
          </div>
        </div>
      </tab-content>
      <tab-content title="Location & Contact">
        <div class="row justify-content-center">
          <div class="col-lg-10">
            <div class="fp-card fp-sm-no-card">
              <div class="row mx-n2">
                <div class="col-lg-6 px-2 mb-4 mb-md-0">
                  <h6>
                    {{
                      streetRequired
                        ? "Enter Property Location"
                        : "Choose Post Location"
                    }}
                  </h6>
                  <div class="fp-border-color-1 p-3 border round-10">
                    <div class="form-group">
                      <label>Address</label>
                      <div
                        :class="streetRequired && 'required-input-container'"
                      >
                        <gmap-autocomplete
                          :value="formData.address"
                          class="form-control w-100"
                          @place_changed="updateAddress"
                          :placeholder="`Enter street address ${
                            streetRequired ? '' : '(Optional)'
                          }`"
                          style="max-width: 100%"
                          @keypress.enter="$event.preventDefault()"
                          :options="gmapAutocompleteOptions"
                        ></gmap-autocomplete>
                        <div
                          v-if="streetRequired && hasError('address')"
                          class="text-danger"
                        >
                          <div
                            class="error"
                            v-if="!$v.formData.address.required"
                          >
                            The street address is required
                          </div>
                        </div>
                      </div>
                    </div>
                    <div class="row mx-n1">
                      <div class="col-md-6 px-1 mb-3">
                        <label>Zip Code <sup class="text-danger">*</sup></label>
                        <gmap-autocomplete
                          class="form-control w-100"
                          :value="formData.zipcode"
                          @place_changed="updateAddress"
                          @input="formData.zipcode = $event.target.value"
                          placeholder="Enter zip"
                          style="max-width: 100%"
                          :options="gmapAutocompleteOptions"
                        ></gmap-autocomplete>
                        <div v-if="hasError('zipcode')" class="text-danger">
                          <div
                            class="error"
                            v-if="!$v.formData.zipcode.required"
                          >
                            Zip Code is required
                          </div>
                          <div
                            class="error"
                            v-if="!$v.formData.zipcode.numeric"
                          >
                            Zip Code must be numbers
                          </div>
                          <div
                            class="error"
                            v-if="!$v.formData.zipcode.maxLength"
                          >
                            Max 9 digits allowed.
                          </div>
                        </div>
                      </div>
                      <div class="col-md-6 px-1 mb-3">
                        <label>City <sup class="text-danger">*</sup></label>
                        <input
                          type="text"
                          class="form-control"
                          v-model="formData.city"
                          placeholder="Enter city"
                          readonly
                        />
                        <div v-if="hasError('city')" class="text-danger">
                          <div class="error" v-if="!$v.formData.city.required">
                            City is required
                          </div>
                        </div>
                      </div>
                      <div class="col-md-12 px-1">
                        <label>State <sup class="text-danger">*</sup></label>
                        <input
                          type="text"
                          class="form-control"
                          v-model="formData.state"
                          placeholder="Enter state"
                          readonly
                        />
                        <div v-if="hasError('state')" class="text-danger">
                          <div class="error" v-if="!$v.formData.state.required">
                            State is required
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="col-lg-6 px-2">
                  <h6>Post Contact Details</h6>
                  <div
                    class="fp-border-color-1 p-3 border round-10 contact-details-input"
                  >
                    <div class="form-group">
                      <label>Email</label>
                      <input
                        type="email"
                        class="form-control"
                        v-model="formData.contact_email"
                        maxlength="100"
                        placeholder="Email (Recommended)"
                      />
                      <span class="fp-text-active"
                        >* We will not disclose your email</span
                      >
                    </div>
                    <div class="form-group">
                      <label for="" class="mb-2">Phone</label>
                      <input
                        type="text"
                        class="form-control"
                        v-model="formData.contact_phone_number"
                        maxlength="50"
                        placeholder="Phone (Optional)"
                      />
                    </div>
                    <div class="form-group">
                      <label for="" class="mb-2">Web Link</label>
                      <input
                        type="text"
                        class="form-control"
                        v-model="formData.contact_weblink"
                        maxlength="300"
                        placeholder="Any web links (Optional)"
                      />
                    </div>
                    <div class="d-flex justify-content-between">
                      <div class="d-inline-flex custom-control custom-checkbox">
                        <input
                          v-model="formData.enable_chat"
                          type="checkbox"
                          class="custom-control-input"
                          id="enable_chat"
                        />
                        <label class="custom-control-label" for="enable_chat"
                          >Chat</label
                        >
                      </div>
                      <div
                        class="d-inline-flex custom-control custom-checkbox ml-auto"
                      >
                        <input
                          v-model="formData.no_reply_to_this_post"
                          type="checkbox"
                          class="custom-control-input"
                          id="no_reply_to_this_post"
                          @change="noReply"
                        />
                        <label
                          class="custom-control-label"
                          for="no_reply_to_this_post"
                          >No reply to this post</label
                        >
                      </div>
                    </div>
                  </div>
                </div>
                <div class="col-12">
                  <div
                    class="border fp-border-color-1 round-10 overflow-hidden"
                    style="
                      height: calc(100% - 85px);
                      min-height: 300px;
                      margin-top: 35px;
                    "
                  >
                    <GmapMap
                      ref="mapRef"
                      :options="{
                        mapTypeControl: false,
                        streetViewControl: false,
                      }"
                      :center="map_center"
                      :zoom="11"
                      map-type-id="roadmap"
                      style="width: 100%; height: 100%"
                    >
                      <GmapCircle
                        :center="{
                          lat: Number(formData.location.latitude),
                          lng: Number(formData.location.longitude),
                        }"
                        :radius="7000"
                        :visible="true"
                        :editable="true"
                        :options="{
                          fillColor: 'green',
                          fillOpacity: 0.3,
                          strokeColor: 'green',
                          strokeOpacity: 0.5,
                          strokeWeight: 2,
                        }"
                      />
                    </GmapMap>
                  </div>
                  <p
                    class="mt-1 mb-0 fp-text-clolor-main"
                    style="font-weight: 400"
                  >
                    The location data here is only for information purposes. May
                    not be accurate.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </tab-content>
      <tab-content title="Submit" :selected="action === 'repost'">
        <div>
          <div class="d-flex justify-content-center align-items-center mb-3">
            <h5
              class="text-underline mb-0"
              style="cursor: pointer"
              @click="submit()"
            >
              Review &amp; Submit
            </h5>
          </div>

          <h6 class="mb-1" style="font-weight: 700; font-size: 17px">
            {{ formData.title }}
          </h6>
          <PostDetail :post="formData"></PostDetail>
          <div class="mt-3 text-center">
            <div class="custom-control custom-checkbox">
              <input
                type="checkbox"
                class="custom-control-input"
                :class="{ invalid: !formData.isAccepted && clicked_submit }"
                id="is_accepted"
                name="accept"
                v-model="formData.isAccepted"
              />
              <label
                class="custom-control-label fp-text-color-main"
                for="is_accepted"
                >I have read and accept the
                <a
                  href="/learn/terms_of_use"
                  class="fp-text-active"
                  target="_blank"
                  >Terms of use</a
                >
                and
                <a
                  href="/learn/privacy_policies"
                  class="fp-text-active"
                  target="_blank"
                  >Privacy policy</a
                ></label
              >
            </div>
          </div>
          <!-- <div class="progress-container" v-if="loading">
            <div class="progress">
              <div
                class="progress-bar"
                role="progressbar"
                style=""
                aria-valuemin="0"
                aria-valuemax="100"
                ref="progresStatus"
              >
                {{ this.progress }}
              </div>
            </div>
            <div class="progress-content">
              <img
                src="~/assets/images/logo_loading.gif"
                alt="loading"
                width="80"
              />
            </div>
          </div> -->

          <!-- loader view start -->

          <div class="fp-loading" v-if="loading">
            <img
              src="@/assets/images/logo_loading.gif"
              width="100"
              height="100"
              alt=""
            />
            <div class="progress mt-3 mt-md-4">
              <div
                class="progress-bar bg-success"
                :style="{ width: `${this.progress}%` }"
              >
                {{ this.progress }}%
              </div>
            </div>
          </div>
          <!-- loader view end -->
        </div>
      </tab-content>
    </form-wizard>

    <portal to="mobile-page-title">
      <h6 class="mb-0 mobile-page-title">Classified Ad</h6>
    </portal>
  </div>
</template>
<script>
import Multiselect from "vue-multiselect";
import "vue-multiselect/dist/vue-multiselect.min.css";
import { FormWizard, TabContent, ValidationHelper } from "vue-step-wizard";
import "vue-step-wizard/dist/vue-step-wizard.css";
import { required, maxLength, numeric } from "vuelidate/lib/validators";
import { mapGetters } from "vuex";
import PostDetail from "~/components/ads/PostDetail.vue";
import FpUploader from "~/components/ads/form_elements/Uploader.vue";
import Datepicker from "vuejs-datepicker";
import loading from "../../plugins/loading";
import Uploading from "../elements/Uploading.vue";
export default {
  props: ["mode", "id", "action"],
  mixins: [ValidationHelper],
  components: {
    Multiselect,
    FormWizard,
    TabContent,
    PostDetail,
    FpUploader,
    Datepicker,
    Uploading,
  },
  data() {
    return {
      selected_category: null,
      selected_sub_category: null,
      sub_categories: [],
      expand_sub_categories: false,
      formData: {
        id: "",
        user_id: null,
        user: null,
        category: "",
        category_id: "",
        sub_category: "",
        sub_category_id: "",
        title: "",
        description: "",
        contact_email: "",
        contact_phone_number: "",
        contact_weblink: "",
        enable_chat: true,
        no_reply_to_this_post: false,
        location: {
          country: "",
          city: "",
          state: "",
          county: "",
          zipcode: "",
          address: "",
          full_address: "",
          latitude: "",
          longitude: "",
        },
        address: "",
        full_address: "",
        zipcode: "",
        city: "",
        state: "",

        service_provider: "",
        services: [],
        locations: [],
        business_hours: "",
        realtor: "",
        license: "",
        rent_lease_item: "",
        rent_lease_cost: "",
        rent_lease_term: "",
        trainer_institute: "",
        training_fee: "",
        training_courses: [],
        training_modes: [],
        sale_by: "",
        condition: "",
        cost: "",
        model: "",
        manufacturer: "",
        job_title: "",
        client_recruiter: "",
        employement_types: [],
        compensation: "",
        interview_mode: "",
        remote_work_from_home: "",
        benefits: [],
        work_authorizations: [],
        job_options: [],
        house_type: "",
        bed_rooms: "",
        bath_rooms: "",
        furnished: "",
        property_area: "",
        rent_other_utilities: "",
        stay_available_for: [],
        available_from: "",
        available_from_today: false,
        smoking_allowed: "",
        pets_allowed: "",
        accommodation_properties: [],
        accommodation_amenities: [],
        automotive_make_manufacturer: "",
        automotive_model: "",
        automotive_year: "",
        automotive_color: "",
        breed_species_type: "",
        pet_age: "",
        pet_color: "",
        pet_sex: "",
        pet_size_weight: "",
        pet_characteristics: "",

        business_location: {
          country: "",
          city: "",
          state: "",
          county: "",
          zipcode: "",
          address: "",
          full_address: "",
          latitude: "",
          longitude: "",
        },
        business_address: "",
        business_full_address: "",
        business_zipcode: "",
        business_city: "",
        business_state: "",

        compensation_unit: "Month",
        rent_other_utilities_unit: "Month",
        property_area_unit: "Sq.ft",
        rent_lease_unit: "for rent",
        cost_unit: "Month",

        images: [],
        diff_time: "just now",
        isAccepted: false,
      },
      map_center: { lat: 32.9184763, lng: -117.1382404 },
      step: 1,
      form_submitted: false,
      //which is handled by the mixin of ValidationHelper used in the form-wizard. details check the vue-step-wizard repo
      validationRules: [
        { category: { required } },
        { title: { required } },
        {},
        {},
        {
          zipcode: { required, numeric, maxLength: maxLength(9) },
          city: { required },
          state: { required },
        },
        { isAccepted: { required } },
      ],
      uploadImageUrl: `${process.env.adsApiUrl}/post/upload_image`,
      removeImageUrl: `${process.env.adsApiUrl}/post/image/delete/`,
      location_form: {
        value: "",
      },
      employement_types: [
        "Full-time",
        "Part-time",
        "Internship",
        "Contract: Corp-to-Corp",
        "Contract: W2",
        "Contract-to-hire",
        "Independent Contractor",
        "Regular or Permanent",
        "On-Call",
        "Temporary",
        "Seasonal Job",
        "Commision only",
        "Commission + Base Salary",
        "Volunteer",
        "Other type",
        "TBD (To Be Discussed)",
      ],
      benefits: [
        "401(k)plan",
        "Dental Insurance",
        "Paid Time Off(PTO)",
        "Life Insurance",
        "Health Insurance",
        "Paid Sick Leave",
        "Vision Insurance",
      ],
      work_authorizations: [
        "Any Valid Work Visa",
        "US Citizen",
        "Green Card",
        "EAD TN",
        "H1B",
        "L1",
        "L2",
        "CPT",
        "OPT/STEM",
        "M1",
        "J1",
        "Other",
      ],
      clicked_submit: false,
      loading: false,
      progress: 0,
      gmapAutocompleteOptions: {
        componentRestrictions: { country: ["us", "ca"] },
      },
    };
  },
  computed: {
    description_chars: function () {
      if (!this.formData.description) return 0;
      return this.formData.description.length;
    },
    placeholder_service_provider() {
      let categoryName = this.selected_category?.name;
      if (categoryName === "Services") return "Ex. ABC company";
      if (categoryName === "Repairs") return "Ex. RGroup/Ramana";
      if (categoryName === "Skilled Trades") return "Ex. ABC company";
      if (categoryName === "Gigs/Freelancers") return "Ex. Company/Your name";
      if (categoryName === "Legal/Lawyers") return "Ex. ABC organization";
      if (categoryName === "Pets") return "Business or Your name";
      return "Ex. RGroup or Ramana";
    },
    placeholder_list_of_services() {
      let categoryName = this.selected_category?.name;
      if (categoryName === "Services") return "Ex. Cloud solutions";
      if (categoryName === "Repairs") return "Ex. AC repair/ Duct work";
      if (categoryName === "Skilled Trades") return "Ex. Plumbing/Roofing";
      if (categoryName === "Gigs/Freelancers") return "Ex. Resume writing";
      if (categoryName === "Legal/Lawyers") return "Ex. Family Law";
      if (categoryName === "Pets") return "Ex. Pet Grooming";
      return "Ex. Cloud solutions";
    },
    placeholder_hours_of_operation() {
      // let categoryName = this.selected_category?.name
      // if (categoryName === 'Services') return 'Explain open hours';
      // if (categoryName === 'Gigs/Freelancers') return 'Explain open hours';
      // if (categoryName === 'Repairs') return 'Explain open hours';
      // if (categoryName === 'Pets') return 'Enter open hours';
      return "Enter open hours";
    },
    max_length_service_provider() {
      let categoryName = this.selected_category?.name;
      if (categoryName === "Services") return 40;
      if (
        categoryName === "Pets" &&
        this.selected_sub_category &&
        this.selected_sub_category.name === "Pet Care"
      )
        return 50;
      if (categoryName === "Pets") return 30;
      return 50;
    },
    max_length_list_of_services() {
      let categoryName = this.selected_category?.name;
      if (categoryName === "Legal/Lawyers") return 30;
      if (
        categoryName === "Pets" &&
        this.selected_sub_category &&
        this.selected_sub_category.name === "Pet Care"
      )
        return 50;
      if (categoryName === "Pets") return 50;
      return 30;
    },
    streetRequired() {
      return (
        this.selected_category &&
        ["Real Estate", "Accommodation", "Rent/Lease"].includes(
          this.selected_category.name
        )
      );
    },
    ...mapGetters({
      auth_user: "auth/user",
      categories: "ads/categories",
      authenticated: "auth/check",
      location: "ads/location",
      previewImages: "ads/previewImages",
    }),
  },
  watch: {
    selected_category: function (newVal) {
      if (newVal) {
        this.formData.category_id = newVal.id;
        this.formData.category = newVal;
        this.getSubCategories(newVal.id);
        if (
          ["Real Estate", "Accommodation", "Rent/Lease"].includes(newVal.name)
        ) {
          this.validationRules[4].address = { required };
        }
        if (newVal.name === "Jobs") {
          this.validationRules[2].job_title = { required };
        } else if (newVal.name === "Accommodation") {
          this.validationRules[2].house_type = { required };
        } else if (newVal.name === "Real Estate") {
          this.validationRules[2].house_type = { required };
          this.validationRules[2].property_area = { required };
          this.validationRules[2].cost = { required };
        } else {
          this.validationRules[2] = {};
        }
      } else {
        this.formData.category_id = "";
        this.formData.category = "";
        this.sub_categories = [];
        this.selected_sub_category = null;
      }
    },
    selected_sub_category: function (newVal) {
      if (newVal) {
        this.formData.sub_category_id = newVal.id;
        this.formData.sub_category = newVal;
      } else {
        this.formData.sub_category_id = "";
        this.formData.sub_category = "";
      }
    },
    "formData.contact_email": function (newVal) {
      this.formData.no_reply_to_this_post =
        newVal == "" &&
        this.formData.contact_phone_number == "" &&
        !this.formData.enable_chat;
    },
    "formData.contact_phone_number": function (newVal) {
      this.formData.no_reply_to_this_post =
        newVal == "" &&
        this.formData.contact_email == "" &&
        !this.formData.enable_chat;
    },
    "formData.enable_chat": function (newVal) {
      this.formData.no_reply_to_this_post =
        !newVal &&
        this.formData.contact_email == "" &&
        this.formData.contact_phone_number == "";
    },
    "formData.no_reply_to_this_post": function (newVal) {
      if (newVal) {
        this.formData.contact_email = "";
        this.formData.contact_phone_number = "";
        this.formData.enable_chat = false;
      } else {
        this.formData.contact_email = this.auth_user.email;
        this.formData.enable_chat = true;
      }
    },
    "formData.fromavailable": function (newVal) {
      this.updateBusinessHours();
    },
    "formData.toavailable": function (newVal) {
      this.updateBusinessHours();
    },
  },
  mounted() {
    this.$store.dispatch("ads/getCategories");
    if (this.mode === "add") {
      this.init();
    } else {
      this.loadPost();
      if (this.action === "repost") this.step = 6;
    }
    this.formData.user = this.auth_user;
  },
  methods: {
    init() {
      this.formData.contact_email = this.auth_user.profile
        ? this.auth_user.profile.contact_email
        : this.auth_user.email;
      this.formData.enable_chat = this.auth_user.profile
        ? this.auth_user.profile.enable_chat
        : true;
      this.formData.contact_phone_number = this.auth_user.profile
        ? this.auth_user.profile.contact_phone_number
        : this.auth_user.phone_number;
      let location = this.auth_user.location;
      if (location) {
        this.formData.location = Object.assign(
          ...Object.keys(this.formData.location).map((k) => ({
            [k]: location[k],
          }))
        );
        this.formData.address = location.address;
        this.formData.full_address = location.full_address;
        this.formData.city = location.city;
        this.formData.state = location.state;
        this.formData.zipcode = location.zipcode;
        if (location.latitude && location.longitude) {
          this.map_center = {
            lat: Number(location.latitude),
            lng: Number(location.longitude),
          };
        }
      }
    },
    updateBusinessHours() {
      if (this.formData.fromavailable && this.formData.toavailable) {
        this.formData.business_hours = `${this.formData.fromavailable} to ${this.formData.toavailable}`;
      } else {
        this.formData.business_hours = "";
      }
    },
    loadPost() {
      this.axios
        .post(`${process.env.adsApiUrl}/post/get_detail`, { id: this.id })
        .then((response) => {
          let post = response.data.data;
          this.formData = {
            id: post.id,
            category: post.category,
            category_id: post.category_id,
            sub_category: post.sub_category,
            sub_category_id: post.sub_category_id,
            title: post.title,
            description: post.description,
            contact_email: post.contact_email,
            contact_phone_number: post.contact_phone_number,
            contact_weblink: post.contact_weblink,
            enable_chat: post.enable_chat,
            no_reply_to_this_post: post.no_reply_to_this_post,
            location: post.location,
            zipcode: post.location.zipcode,
            city: post.location.city,
            state: post.location.state,
            address: post.location.address,
            full_address: post.location.full_address,
            service_provider: post.service_provider,
            services: post.services ? post.services : [],
            business_hours: post.business_hours,
            locations: post.locations ? post.locations : [],

            realtor: post.realtor,
            license: post.license,
            rent_lease_item: post.rent_lease_item,
            rent_lease_cost: post.rent_lease_cost,
            rent_lease_term: post.rent_lease_term,
            trainer_institute: post.trainer_institute,
            training_fee: post.training_fee,
            training_courses: post.training_courses,
            training_modes: post.training_modes,
            job_title: post.job_title,
            sale_by: post.sale_by,
            condition: post.condition,
            cost: post.cost,
            model: post.model,
            manufacturer: post.manufacturer,
            client_recruiter: post.client_recruiter,
            employement_types: post.employement_types,
            compensation: post.compensation,
            interview_mode: post.interview_mode,
            remote_work_from_home: post.remote_work_from_home,
            benefits: post.benefits,
            work_authorizations: post.work_authorizations,
            job_options: post.job_options,
            house_type: post.house_type,
            bed_rooms: post.bed_rooms,
            bath_rooms: post.bath_rooms,
            furnished: post.furnished,
            property_area: post.property_area,
            rent_other_utilities: post.rent_other_utilities,
            stay_available_for: post.stay_available_for,
            available_from: post.available_from,
            smoking_allowed: post.smoking_allowed,
            pets_allowed: post.pets_allowed,
            accommodation_properties: post.accommodation_properties,
            accommodation_amenities: post.accommodation_amenities,
            automotive_make_manufacturer: post.automotive_make_manufacturer,
            automotive_model: post.automotive_model,
            automotive_year: post.automotive_year,
            automotive_color: post.automotive_color,

            breed_species_type: post.breed_species_type,
            pet_age: post.pet_age,
            pet_color: post.pet_color,
            pet_sex: post.pet_sex,
            pet_size_weight: post.pet_size_weight,
            pet_characteristics: post.pet_characteristics,

            business_location: post.business_location,
            business_zipcode: post.business_location.zipcode,
            business_city: post.business_location.city,
            business_state: post.business_location.state,
            business_address: post.business_location.address,
            business_full_address: post.business_location.full_address,

            compensation_unit: post.compensation_unit,
            rent_other_utilities_unit: post.rent_other_utilities_unit,
            property_area_unit: post.property_area_unit,
            rent_lease_unit: post.rent_lease_unit,
            cost_unit: post.cost_unit,

            images: post.images,
            diff_time: post.diff_time,
          };
          this.selected_category = post.category;
          this.selected_sub_category = post.sub_category;
          this.map_center = {
            lat: Number(post.location.latitude),
            lng: Number(post.location.longitude),
          };
        });
    },
    nextStep() {
      this.step++;
      console.log("step is", this.step);
    },
    previousStep() {
      this.step--;
      console.log("step is", this.step);
    },
    async uploadImage(image) {
      try {
        const formData = new FormData();
        formData.append("image", image.file);

        const response = await this.axios.post(
          `${process.env.adsApiUrl}/post/upload_image`,
          formData
        );

        if (response.data.status === "Success") {
          return response.data.data;
        } else {
          throw new Error("Image upload failed");
        }
      } catch (error) {
        console.error("Image upload error:", error);
        throw error;
      }
    },
    async submit() {
      if (this.formData.isAccepted == false) {
        this.clicked_submit = true;
        return false;
      }
      let uri =
        this.mode == "edit"
          ? `${process.env.adsApiUrl}/post/update`
          : `${process.env.adsApiUrl}/post/store`;
      this.loading = true;
      try {
        const uploadedImages = [];
        const totalImages = this.previewImages.length;
        let count = 0;
        for (const image of this.previewImages) {
          const uploadedImage = await this.uploadImage(image);
          uploadedImages.push(uploadedImage);
          count++;
          this.progress = Math.floor((count / totalImages) * 100);
          // this.$refs.progresStatus.style.width = this.progress + "%";
        }

        this.formData.images = uploadedImages;

        const response = await this.axios.post(uri, this.formData);
        this.loading = false;
        if (response.data.status == "Success") {
          let result = response.data.data;
          this.formData.id = result.id;
          this.form_submitted = true;
          this.$store.dispatch("fetchNotifications");
          this.$store.commit("ads/CLEAR_PREVIEW_IMAGES");
          if (this.mode == "edit") {
            this.$router.push({ name: "account.ads" });
          } else {
            this.$router.push({
              name: "ads.activate",
              query: { id: result.id, email: result.contact_email },
            });
          }
        }
      } catch (error) {
        console.log(error);
      }
    },
    selectCategory(item) {
      if (
        this.selected_category &&
        item &&
        this.selected_category.id == item.id
      ) {
        this.selected_category = null;
      } else {
        this.selected_category = item;
      }
    },
    getSubCategories(category_id) {
      let params = {
        category_id: category_id,
        country_code: this.location ? this.location.country : "",
      };
      this.axios
        .post(`${process.env.adsApiUrl}/category/get_sub_categories`, params)
        .then((response) => {
          this.sub_categories = response.data.data;
        });
    },
    selectSubCategory(item) {
      if (
        this.selected_sub_category &&
        item &&
        this.selected_sub_category.id == item.id
      ) {
        this.selected_sub_category = null;
      } else {
        this.selected_sub_category = item;
      }
    },
    updateAddress(place) {
      this.map_center.lat = this.formData.location.latitude =
        place.geometry["location"].lat();
      this.map_center.lng = this.formData.location.longitude =
        place.geometry["location"].lng();

      for (var i = 0; i < place.address_components.length; i++) {
        for (var j = 0; j < place.address_components[i].types.length; j++) {
          if (place.address_components[i].types[j] === "postal_code") {
            this.formData.location.zipcode =
              place.address_components[i].long_name;
            this.formData.zipcode = place.address_components[i].long_name;
          }
          if (
            place.address_components[i].types[j] ===
            "administrative_area_level_1"
          ) {
            this.formData.location.state =
              place.address_components[i].short_name;
            this.formData.state = place.address_components[i].short_name;
          }
          if (
            place.address_components[i].types[j] ===
            "administrative_area_level_2"
          ) {
            let county = place.address_components[i].short_name;
            county = county.replace(" County", "");
            this.formData.location.county = county;
          }
          if (place.address_components[i].types[j] === "locality") {
            this.formData.location.city = place.address_components[i].long_name;
            this.formData.city = place.address_components[i].long_name;
          }
          if (place.address_components[i].types[j] === "country") {
            this.formData.location.country =
              place.address_components[i].short_name;
          }
        }
      }
      this.formData.address = place.name;
      this.formData.location.address = place.name;
      this.formData.full_address = place.formatted_address;
      this.formData.location.full_address = place.formatted_address;
    },
    updateBusinessAddress(place) {
      this.map_center.lat = this.formData.business_location.latitude =
        place.geometry["location"].lat();
      this.map_center.lng = this.formData.business_location.longitude =
        place.geometry["location"].lng();
      for (var i = 0; i < place.address_components.length; i++) {
        for (var j = 0; j < place.address_components[i].types.length; j++) {
          if (place.address_components[i].types[j] === "postal_code") {
            this.formData.business_location.zipcode =
              place.address_components[i].long_name;
            this.formData.business_zipcode =
              place.address_components[i].long_name;
          }
          if (
            place.address_components[i].types[j] ===
            "administrative_area_level_1"
          ) {
            this.formData.business_location.state =
              place.address_components[i].short_name;
            this.formData.business_state =
              place.address_components[i].short_name;
          }
          if (
            place.address_components[i].types[j] ===
            "administrative_area_level_2"
          ) {
            let county = place.address_components[i].short_name;
            county = county.replace(" County", "");
            this.formData.business_location.county = county;
          }
          if (place.address_components[i].types[j] === "locality") {
            this.formData.business_location.city =
              place.address_components[i].long_name;
            this.formData.business_city = place.address_components[i].long_name;
          }
          if (place.address_components[i].types[j] === "country") {
            this.formData.business_location.country =
              place.address_components[i].short_name;
          }
        }
      }
      this.formData.business_address = place.name;
      this.formData.business_location.address = place.name;
      this.formData.business_full_address = place.formatted_address;
      this.formData.business_location.full_address = place.formatted_address;
    },
    addService() {
      if (this.formData.services.length >= 15) {
        this.$fpError(
          "Max list of services is reached. Please add full list of services in post details."
        );
        return false;
      }
      let service = this.$refs.service_form.value;
      this.formData.services.push(service);
      this.$refs.service_form.value = "";
    },
    removeService(item) {
      let index = this.formData.services.indexOf(item);
      this.formData.services.splice(index, 1);
    },
    addProperty() {
      if (this.formData.accommodation_properties.length >= 15) {
        this.$fpError(
          "Max list of property is reached. Please add full list of property in post details."
        );
        return false;
      }
      let item = this.$refs.property_form.value;
      this.formData.accommodation_properties.push(item);
      this.$refs.property_form.value = "";
    },
    removeProperty(index) {
      this.formData.accommodation_properties.splice(index, 1);
    },
    addTrainingCourse() {
      if (this.formData.training_courses.length >= 15) {
        this.$fpError(
          "Max list of training is reached. Please add full list of training in post details."
        );
        return false;
      }
      let item = this.$refs.training_course_form.value;
      this.formData.training_courses.push(item);
      this.$refs.training_course_form.value = "";
    },
    removeTrainingCourse(index) {
      this.formData.training_courses.splice(index, 1);
    },
    addAmenity() {
      if (this.formData.accommodation_amenities.length >= 15) {
        this.$fpError(
          "Max list of amenity is reached. Please add full list of amenity in post details."
        );
        return false;
      }
      let item = this.$refs.amenity_form.value;
      this.formData.accommodation_amenities.push(item);
      this.$refs.amenity_form.value = "";
    },
    removeAmenity(index) {
      this.formData.accommodation_amenities.splice(index, 1);
    },
    addBenefit() {
      let benefit = this.$refs.benefit_form.value;
      this.benefits.push(benefit);
      this.$refs.benefit_form.value = "";
    },
    addLocation(place) {
      for (var i = 0; i < place.address_components.length; i++) {
        for (var j = 0; j < place.address_components[i].types.length; j++) {
          if (
            place.address_components[i].types[j] ===
            "administrative_area_level_1"
          ) {
            let state = place.address_components[i].short_name;
            if (this.formData.locations.includes(state) === false) {
              this.formData.locations.push(state);
            }
            this.location_form.value = "";
          }
        }
      }
    },
    removeLocation(item) {
      let index = this.formData.locations.indexOf(item);
      this.formData.locations.splice(index, 1);
    },
    imageRemoved(index) {
      this.formData.images.splice(index, 1);
    },
    goToPreviousStep() {
      document.querySelector(".step-button.step-button-previous").click();
    },
    getWordCount(value) {
      value = value.replace(/\n/g, " ");
      let arr = value.split(" ");
      return arr.filter((i) => i !== "").length;
    },
    availableFromToday(e) {
      if (e.target.checked) {
        this.formData.available_from = this.$moment().format("MM/DD/YYYY");
        this.formData.available_from_today = true;
      } else {
        this.formData.available_from_today = false;
      }
    },
    isBeforeDate(value) {
      return new Date(value).valueOf() < new Date().valueOf();
    },
  },
};
</script>
<style lang="scss" scoped>
.form-content {
  width: 100%;
  max-width: 850px;
  margin: 0 auto;
}

.category-container {
  display: flex;

  @media (min-width: 601px) {
    margin-right: -16px;
    margin-bottom: -16px;
    flex-wrap: wrap;
  }

  @media (max-width: 600px) {
    width: 100%;
    overflow: auto;
  }

  .category.button-view {
    font-weight: 500;
  }
}

.sub-category-container {
  @media (max-width: 600px) {
    margin-right: -8px;

    .category {
      margin-right: 8px;
      margin-bottom: 8px;
      padding: 6px 8px;
    }
  }
}

.step-title {
  text-align: center;
}

.sub-title {
  font-size: 18px;
}

.col-form-label {
  font-size: 16px;
  font-weight: 500;
}

.location-description {
  font-size: 16px;
}

.label-warning {
  font-size: 14.4px;
  color: #355262;
  margin-left: 20px;
}

.inline-form-container {
  width: 300px;
  margin-bottom: 15px;

  @media (max-width: 600px) {
    width: 100%;
  }
}

.information-item {
  display: inline-block;
  border: solid 1px #64748b;
  color: #64748b;
  padding: 4px 8px 2px;
  margin-top: 8px;
  margin-right: 8px;
  font-size: 14.4px;
  font-weight: 400;
  border-radius: 5px;
  white-space: nowrap;

  .btn-remove {
    margin-left: 5px;
    cursor: pointer;
  }
}

.add-benefit-form {
  display: inline-flex;
  width: 220px;
}

.contact-details-input {
  input::placeholder {
    font-size: 14.4px;
  }
}
</style>
<style lang="scss" scoped>
.form-post::v-deep {
  .vue-step-wizard {
    width: 100%;
    padding: 0;
    background-color: transparent;
  }

  .step-pills {
    @media (max-width: 600px) {
      display: none;
    }
  }

  .step-progress {
    display: none;
  }

  .step-body {
    padding: 1rem;
    border-radius: 1rem;
    border: none;
    border-radius: 0;
    box-shadow: none !important;
    background: none;
  }

  .step-button {
    border-radius: 3px;

    &.step-button-next {
      font-size: 15px;
      font-weight: 400;
      color: #fff;
      background: linear-gradient(94.82deg, #ff22a1 2.26%, #ffa3d8 98.55%);
      border: none;
      border-radius: 8px;
      padding: 10px 40px;
      text-transform: capitalize;
    }

    &.step-button-previous {
      font-size: 15px;
      font-weight: 400;
      color: #64748b;
      background: transparent;
      border: solid 1px #ff22a1;
      border-radius: 8px;
      padding: 10px 28px;
      text-transform: capitalize;
    }

    &.step-button-submit {
      border: none;
      background: linear-gradient(92.21deg, #ff22a1 -3.4%, #ffa3d8 100%);
      text-transform: capitalize;
      color: #fff;
      border-radius: 5px;
      font-size: 15px;
      padding-top: 7px;
      padding-bottom: 7px;

      &:hover {
        color: #fff;
      }
    }
  }
}

.cus-btn {
  width: 95px;
}
.form-post::v-deep .form-submitted {
  .step-footer {
    display: none;
  }
}

.form-post.loading::v-deep {
  .step-button-submit {
    position: relative;
    pointer-events: none;
    color: transparent !important;

    &:after {
      animation: spinAround 500ms infinite linear;
      border: 2px solid #dbdbdb;
      border-radius: 50%;
      border-right-color: transparent;
      border-top-color: transparent;
      content: "";
      display: block;
      height: 1em;
      width: 1em;
      position: absolute;
      left: calc(50% - (1em / 2));
      top: calc(50% - (1em / 2));
    }
  }

  @keyframes spinAround {
    from {
      transform: rotate(0deg);
    }

    to {
      transform: rotate(359deg);
    }
  }
}

.form-post {
  &::v-deep .step-body {
    padding: 1rem 0;
  }

  &[data-step="step_1"]::v-deep {
    .step-button-previous {
      display: none;
    }
  }

  &.form_submitted::v-deep {
    .step-footer {
      display: none;
    }

    .step-item {
      pointer-events: none;
    }
  }

  &::v-deep .step-footer {
    margin-top: 0;
    padding-top: 0;
  }
}

[data-theme="dark"] {
  .step-button-previous {
    color: #fff;
  }
}
</style>
<style lang="scss" scoped>
.fp-loading {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  z-index: 100000;
  background: #00000080;
  .progress {
    height: 23px;
    width: 380px;
    text-align: right;
    background: #ffffff26;
    border-radius: 6px;
    @media (max-width: 600px) {
      width: 80%;
    }
  }
  @media (max-width: 600px) {
    img {
      width: 64px;
      height: 64px;
    }
    .progress {
      height: 18px;
    }
  }
}
</style>
