<template>
  <div class="form-post px-md-3" :data-step="`step_${storeState.currentTab + 1}`" :class="{
    form_submitted: step == last_step && form_submitted,
    loading: loading,
  }">
    <form-wizard v-if="profileLoaded" @onPreviousStep="previousStep()" @onComplete="submit()" previousButtonText="Back"
                 nextButtonText="Next" submitButtonText="Submit">
      <tab-content title="Select Category">
        <div class="form-content">
          <div v-if="this.isSellerProfile" class="fp-card step-card form-step-content  d-lg-flex">
            <div class="category-container mb-4 mb-lg-0">
              <div class="w-100  mb-4">
                <div>
                  <h6 class="fp-text-color-main mb-4">
                    Select Post Category <span class="text-danger">*</span>

                  </h6>
                  <div v-if="hasError('automotive_category')" class="text-danger mt-1">
                    <div class="error" v-if="!$v.formData.automotive_category.required">
                      The category is required
                    </div>
                  </div>
                </div>
                <div class="post">
                  <div class="post-category">
                    <div v-for="(item, index) in categories" :key="index" :class="{
                      'category button-view mr-lg-0': true,
                      active: item.id == formData.automotive_category_id,
                      'mb-0': index === categories.length - 1,
                    }" @click="selectCategory(item)">
                      {{ item.name }}
                    </div>
                  </div>
                  <VueSlickCarousel v-bind="sliderSettings">
                    <div v-for="(item, index) in categories" :key="index" :class="{
                      'category button-view mr-lg-0': true,
                      active: item.id == formData.automotive_category_id,
                      'mb-0': index === categories.length - 1,
                    }" @click="selectCategory(item)">
                      {{ item.name }}
                    </div>
                  </VueSlickCarousel>
                </div>

              </div>
            </div>
            <div class="sub-category-container">
              <h6 class="fp-text-color-main mb-4">
                Select or Create new Sub-Category (Optional)
              </h6>
              <form class="mb-2" @submit.prevent="saveSubCategory()">
                <input ref="subCatName" type="text" class="form-control" placeholder="Ex. EV/Hybrid Models" maxlength="50"
                       required />
                <button type="submit" class="btn fp-btn-gradient" ref="subcatSubmitbtn">
                  <fp-icon name="plus" class="fp-fs-20" /> Add
                </button>
              </form>
              <div v-if="formData.automotive_category" class="d-flex flex-wrap pt-3">
                <div v-for="(item, index) in formData.automotive_category
                  .sub_categories" :key="index" class="content-group"
                     :class="{ active: item.id == formData.automotive_sub_category_id, }"
                     @click="selectSubCategory(item)">
                  {{ item.name }}
                  <div class="icon-wrapper">
                    <fa :icon="['far', 'edit']" @click="editSubCategory(item)" />
                    <fa :icon="['far', 'trash-alt']" @click="removeSubCategory(item)" />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div v-else-if="!this.isSellerProfile" class="fp-card step-card fp-sm-no-card">
            <h6 class="text-md-center mb-3 mb-md-4">
              Post in<span class="rule">(Required)</span>
            </h6>
            <div class="category-container">
              <div class="category button-view fp-text-default" v-for="(item, index) in categories" :key="index" :class="{
                'category button-view mr-lg-0': true,
                active: item.id == formData.automotive_category_id,
              }" @click="selectCategory(item)">
                <div v-if="item && item.name">
                  {{ item.name }}
                </div>
                <!-- <span v-if="item.price">({{ item.price_with_currency }})</span> -->
              </div>
            </div>
          </div>
        </div>
      </tab-content>
      <tab-content title="Post Details">
        <div class="form-content">
          <div class="fp-card step-card form-step-content">
            <div class="form-group">
              <label class="control-label">Post subject or title <span class="text-danger">*</span></label>
              <input type="text" class="form-control" placeholder="Enter post subject ..." v-model="formData.title"
                     maxlength="120" />
              <div v-if="hasError('title')" class="text-danger">
                <div class="error" v-if="!$v.formData.title.required">
                  The title is required
                </div>
              </div>
            </div>
            <div class="form-group mb-0">
              <label class="control-label">Description</label>
              <textarea rows="8" class="form-control" v-model="formData.description" placeholder="Enter post details ..."
                        maxlength="100000"></textarea>
              <div class="text-right mt-1">
                <span class="fp-text-color-main">{{ description_chars }}/ 100000</span>
              </div>
            </div>
          </div>
        </div>
      </tab-content>
      <tab-content title="Other details">
        <div class="form-content">
          <div class="fp-card step-card form-step-content">
            <!-- No Category -->
            <div v-if="!formData.automotive_category ||
              formData.automotive_category.name === 'New/Used Parts'
              " class="row mx-n2">
              <ItemInput class="col-lg-6 px-2" label="For Sale" v-model="formData.automotive_item_name" maxLength="50"
                         placeholder="Ex. Hybrid Battery Set" required :hasError="hasError('automotive_item_name')" />
              <ItemSelect class="col-lg-6 px-2" label="Sale by" v-model="formData.sale_by" :options="[
                { value: 'Individual/Owner', text: 'Individual/Owner' },
                { value: 'Local Store', text: 'Local Store' },
                { value: 'Dealer', text: 'Dealer' },
                { value: 'Wholesale Market', text: 'Wholesale Market' },
                { value: 'Other', text: 'Other' },
              ]" />
              <ItemSelect class="col-lg-6 px-2" label="Condition" v-model="formData.condition" :options="[
                { value: 'New', text: 'New' },
                { value: 'Excellent', text: 'Excellent' },
                { value: 'Good', text: 'Good' },
                { value: 'Average', text: 'Average' },
                { value: 'Non-drivable', text: 'Non-drivable' },
                { value: 'For parts only', text: 'For parts only' },
              ]" />
              <PriceInput class="col-lg-6 px-2" label="Asking Price" v-model="formData.cost" maxLength="7"
                          placeholder="Ex. 1,050" />
              <ItemInput class="col-lg-6 px-2" label="Make" v-model="formData.automotive_make_manufacturer" maxLength="20"
                         placeholder="Ex. Ford" />
              <ItemInput class="col-lg-6 px-2" label="Model/Serial Number" v-model="formData.automotive_model"
                         maxLength="20" placeholder="Ex. OK190803023" />
              <ItemTextArea class="col-12 px-2" label="Additional Info" v-model="formData.business_hours" maxLength="200"
                            placeholder="Explan more details.." :showMax="true" />
            </div>
            <div v-if="formData.automotive_category.name === 'ATV/UTV'" class="mt-2">
              <h6>Basic Details</h6>
              <div class="fp-border-color-1 p-2 p-md-3 border round-12 mb-4">
                <div class="row mx-n2">
                  <ItemInput class="col-lg-6 px-2" label="For Sale" v-model="formData.automotive_item_name"
                             placeholder="Ex. Polaris RZR Pro" maxLength="50" required
                             :hasError="hasError('automotive_item_name')" />
                  <ItemInput class="col-lg-6 px-2" label="Make" v-model="formData.automotive_make_manufacturer"
                             maxLength="20" placeholder="Ex. Polaris" />
                  <ItemInput class="col-lg-6 px-2" label="Model" v-model="formData.automotive_model" maxLength="20"
                             placeholder="Ex. RZR Pro R Ultimate" />
                  <ItemInput class="col-lg-6 px-2" label="Year" v-model="formData.automotive_year" maxLength="4"
                             placeholder="Ex. 2022" />
                  <ItemInput class="col-lg-6 px-2" label="Color" v-model="formData.automotive_color" maxLength="20"
                             placeholder="Ex. White" />
                  <ItemSelect class="col-lg-6 px-2" label="Condition" v-model="formData.condition" :options="[
                    { value: 'New', text: 'New' },
                    { value: 'Excellent', text: 'Excellent' },
                    { value: 'Good', text: 'Good' },
                    { value: 'Average', text: 'Average' },
                    { value: 'Non-drivable', text: 'Non-drivable' },
                    { value: 'For parts only', text: 'For parts only' },
                  ]" />
                  <ItemInput class="col-lg-6 px-2" label="Category" v-model="formData.automotive_class"
                             placeholder="Ex. Sport Utility" maxLength="30" />
                  <PriceInput class="col-lg-6 px-2" label="Asking Price" v-model="formData.cost" maxLength="7"
                              placeholder="Ex. 1,050" />
                </div>
              </div>
              <h6>Specific Details</h6>
              <div class="fp-border-color-1 p-2 p-md-3 border round-12">
                <div class="row mx-n2">
                  <ItemInput class="col-lg-6 px-2" label="VIN #" v-model="formData.automotive_vin" maxLength="20"
                             placeholder="Ex. 4DNNUT1L28X75321N" />
                  <ItemInput class="col-lg-6 px-2" label="Odometer" v-model="formData.automotive_odometer" maxLength="20"
                             placeholder="Ex. 850 miles" />
                  <ItemInput class="col-lg-6 px-2" label="Engine Power" v-model="formData.automotive_engine"
                             maxLength="30" placeholder="Ex. 150HP" />
                  <ItemInput class="col-lg-6 px-2" label="Fuel Type" v-model="formData.automotive_fuel_type"
                             maxLength="20" placeholder="Ex. Diesel" />
                  <ItemInput class="col-lg-6 px-2" label="Dimensions" v-model="formData.automotive_dimensions"
                             maxLength="50" placeholder="Ex. 165 x 72.7 x 68.5 in" />
                  <ItemInput class="col-lg-6 px-2" label="Wheel Size" v-model="formData.automotive_wheel_size"
                             maxLength="20" placeholder="Ex. 135 in." />
                  <ItemInput class="col-lg-6 px-2" label="Overall Weight" v-model="formData.automotive_overall_weight"
                             maxLength="30" placeholder="Ex. 1,858Lb (843kg)" />
                  <ItemAdd class="col-lg-6 px-2" label="Features" v-model="formData.automotive_features"
                           placeholder="Ex. Navigation" />
                  <div class="col-12 px-2">
                    <div class="flex-wrap mt-2" style="flex-direction: row" v-show="formData.automotive_features &&
                      formData.automotive_features.length
                      ">
                      <span class="information-item" v-for="(item, index) in formData.automotive_features" :key="index">
                        {{ item }}
                        <fp-icon name="times" class="btn-remove fp-fs-16" @click="removeFeature(item)" />
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div v-if="formData.automotive_category.name === '2-Wheels/Bicycles'" class="mt-2">
              <h6>Basic Details</h6>
              <div class="fp-border-color-1 p-2 p-md-3 border round-12 mb-4">
                <div class="row mx-n2">
                  <ItemInput class="col-lg-6 px-2" label="For Sale" v-model="formData.automotive_item_name" maxLength="50"
                             placeholder="Ex. Mountain Bike" required :hasError="hasError('automotive_item_name')" />
                  <ItemInput class="col-lg-6 px-2" label="Make" v-model="formData.automotive_make_manufacturer"
                             placeholder="Polygon" maxLength="20" />
                  <ItemInput class="col-lg-6 px-2" label="Model/Serial Number" v-model="formData.automotive_model"
                             maxLength="20" placeholder="Ex. Performer" />
                  <PriceInput class="col-lg-6 px-2" label="Year" v-model="formData.automotive_year" maxLength="4"
                              :withCurrency="false" placeholder="Ex. 2015" />
                  <ItemInput class="col-lg-6 px-2" label="Color" v-model="formData.automotive_color" maxLength="20"
                             placeholder="Ex. Red" />
                  <ItemSelect class="col-lg-6 px-2" label="Condition" v-model="formData.condition" :options="[
                    { value: 'New', text: 'New' },
                    { value: 'Excellent', text: 'Excellent' },
                    { value: 'Good', text: 'Good' },
                    { value: 'Average', text: 'Average' },
                    { value: 'Non-drivable', text: 'Non-drivable' },
                    { value: 'For parts only', text: 'For parts only' },
                  ]" />
                  <ItemInput class="col-lg-6 px-2" label="Bicycle Type" v-model="formData.automotive_class" maxLength="30"
                             placeholder="Ex. Mountain" />
                  <PriceInput class="col-lg-6 px-2" label="Asking Price" v-model="formData.cost" maxLength="7"
                              placeholder="Ex. 1,050" />
                </div>
              </div>
              <h6>Specific Details</h6>
              <div class="fp-border-color-1 p-2 p-md-3 border round-12">
                <div class="row mx-n2">
                  <ItemInput class="col-lg-6 px-2" label="Frame Size" v-model="formData.automotive_vin" maxLength="30"
                             placeholder="Ex. XL" />
                  <ItemInput class="col-lg-6 px-2" label="Wheel Size" v-model="formData.automotive_wheel_size"
                             maxLength="20" placeholder="Ex. 27.5 in" />
                  <ItemInput class="col-lg-6 px-2" label="Frame Material" v-model="formData.automotive_engine"
                             maxLength="30" placeholder="Ex. Aluminium" />
                  <ItemInput class="col-lg-6 px-2" label="Brake Type" v-model="formData.automotive_fuel_type"
                             maxLength="20" placeholder="Ex. Disc" />
                  <ItemInput class="col-lg-6 px-2" label="Suspension" v-model="formData.automotive_dimensions"
                             maxLength="50" placeholder="Ex. Rear" />
                  <ItemInput class="col-lg-6 px-2" label="Assist" v-model="formData.automotive_assist" maxLength="20"
                             placeholder="Ex. Peddle" />
                  <ItemInput class="col-lg-6 px-2" label="Handle Bar" v-model="formData.automotive_overall_weight"
                             maxLength="30" placeholder="Ex. Riser" />
                  <ItemAdd class="col-lg-6 px-2" label="Features" v-model="formData.automotive_features"
                           placeholder="Ex. Navigation" />
                  <div class="col-12 px-2 px-lg-5">
                    <div class="flex-wrap mt-2" style="flex-direction: row" v-show="formData.automotive_features &&
                      formData.automotive_features.length
                      ">
                      <span class="information-item" v-for="(item, index) in formData.automotive_features" :key="index">
                        {{ item }}
                        <fa icon="times" class="btn-remove" @click="removeFeature(item)" />
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div v-if="formData.automotive_category.name === 'Boats/Streamers'" class="mt-2">
              <h6>Basic Details</h6>
              <div class="fp-border-color-1 p-2 p-md-3 border round-12 mb-4">
                <div class="row mx-n2">
                  <ItemInput class="col-lg-6 px-2" label="For Sale" v-model="formData.automotive_item_name" maxLength="50"
                             required placeholder="Ex. Sailboat" :hasError="hasError('automotive_item_name')" />
                  <ItemInput class="col-lg-6 px-2" label="VIN #" v-model="formData.automotive_vin" maxLength="20"
                             placeholder="Ex. ABC6689B606" />
                  <ItemInput class="col-lg-6 px-2" label="Make" v-model="formData.automotive_make_manufacturer"
                             placeholder="Catalina" maxLength="20" />
                  <ItemInput class="col-lg-6 px-2" label="Model/Serial Number" v-model="formData.automotive_model"
                             placeholder="Ex. 38AN" maxLength="20" />
                  <ItemInput class="col-lg-6 px-2" label="Year" v-model="formData.automotive_year" maxLength="4"
                             placeholder="Ex. 1978" />
                  <ItemInput class="col-lg-6 px-2" label="Class" v-model="formData.automotive_class" maxLength="30"
                             placeholder="Ex. Daysailer" />
                  <ItemSelect class="col-lg-6 px-2" label="Condition" v-model="formData.condition" :options="[
                    { value: 'New', text: 'New' },
                    { value: 'Excellent', text: 'Excellent' },
                    { value: 'Good', text: 'Good' },
                    { value: 'Average', text: 'Average' },
                    { value: 'Non-drivable', text: 'Non-drivable' },
                    { value: 'For parts only', text: 'For parts only' },
                  ]" />
                  <PriceInput class="col-lg-6 px-2" label="Asking Price" v-model="formData.cost" maxLength="7"
                              placeholder="Ex. 12,600" />
                </div>
              </div>
              <h6>Measurements</h6>
              <div class="fp-border-color-1 p-2 p-md-3 border round-12 mb-4">
                <div class="row mx-n2">
                  <ItemInput class="col-lg-6 px-2" label="Engine Hours" v-model="formData.business_hours" maxLength="20"
                             placeholder="Ex. 1726" />
                  <ItemInput class="col-lg-6 px-2" label="LOA/LWL" v-model="formData.automotive_odometer" maxLength="20"
                             placeholder="Ex. 66.25ft/ 59ft" />
                  <ItemInput class="col-lg-6 px-2" label="Cruising Speed" v-model="formData.automotive_speed"
                             maxLength="30" placeholder="Ex. 10 KN" />
                  <ItemInput class="col-lg-6 px-2" label="Dry Weight" v-model="formData.automotive_dimensions"
                             maxLength="20" placeholder="Ex. 68234 LB" />
                  <ItemInput class="col-lg-6 px-2" label="Fuel Tank" v-model="formData.automotive_fuel_tank"
                             maxLength="50" placeholder="Ex. 109 Gal" />
                  <ItemInput class="col-lg-6 px-2" label="Water Tank" v-model="formData.automotive_wheel_size"
                             maxLength="20" placeholder="Ex. 132 Gal" />
                </div>
              </div>
              <h6>Propulsion</h6>
              <div class="fp-border-color-1 p-2 p-md-3 border round-12 mb-4">
                <div class="row mx-n2">
                  <ItemInput class="col-lg-6 px-2" label="Engine Make" v-model="formData.automotive_engine_make"
                             maxLength="20" placeholder="Ex. Volvo" />
                  <ItemInput class="col-lg-6 px-2" label="Engine Model" v-model="formData.automotive_engine"
                             maxLength="20" placeholder="Ex. D4" />
                  <ItemInput class="col-lg-6 px-2" label="Make Year" v-model="formData.automotive_make_year"
                             maxLength="20" placeholder="Ex. 1999" />
                  <ItemInput class="col-lg-6 px-2" label="Total Power" v-model="formData.automotive_total_power"
                             maxLength="20" placeholder="Ex. 180HP" />
                  <ItemInput class="col-lg-6 px-2" label="Engine Type" v-model="formData.automotive_engine_type"
                             maxLength="20" placeholder="Ex. Inboard" />
                  <ItemInput class="col-lg-6 px-2" label="Drive Type" v-model="formData.automotive_drive_type"
                             maxLength="20" placeholder="Ex. Direct" />
                  <ItemInput class="col-lg-6 px-2" label="Fuel Type" v-model="formData.automotive_fuel_type"
                             maxLength="20" placeholder="Ex. Diesel" />
                  <ItemInput class="col-lg-6 px-2" label="Propeller Type" v-model="formData.automotive_propeller_type"
                             maxLength="20" placeholder="Ex. 3-Blade" />
                </div>
              </div>
              <div>
                <div class="row mx-n2">
                  <ItemAdd class="col-lg-12 px-2" label="Additional Features/Options"
                           v-model="formData.automotive_features" placeholder="Ex. TV/DVD" labelColClass="col-lg-4"
                           inputColClass="col-lg-4" />
                  <div class="col-12 px-2">
                    <div class="flex-wrap mt-2" style="flex-direction: row" v-show="formData.automotive_features &&
                      formData.automotive_features.length
                      ">
                      <span class="information-item" v-for="(item, index) in formData.automotive_features" :key="index">
                        {{ item }}
                        <fa icon="times" class="btn-remove" @click="removeFeature(item)" />
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div v-if="formData.automotive_category.name === 'Cars/Trucks/SUV'" class="mt-2">
              <h6>Basic Details</h6>
              <div class="fp-border-color-1 p-2 p-md-3 border round-12 mb-4">
                <div class="row mx-n2">
                  <ItemInput class="col-lg-6 px-2" label="For Sale" v-model="formData.automotive_item_name" maxLength="50"
                             required :hasError="hasError('automotive_item_name')" placeholder="Ex. Ford Fusion Hybrid" />
                  <ItemInput class="col-lg-6 px-2" label="Make" v-model="formData.automotive_make_manufacturer"
                             maxLength="20" placeholder="Ex. Ford" />
                  <ItemInput class="col-lg-6 px-2" label="Model/Serial Number" v-model="formData.automotive_model"
                             maxLength="20" placeholder="Ex. Fusion" />
                  <ItemInput class="col-lg-6 px-2" label="Year" v-model="formData.automotive_year" maxLength="4"
                             placeholder="Ex. 2015" />
                  <ItemInput class="col-lg-6 px-2" label="Color" v-model="formData.automotive_color" maxLength="20"
                             placeholder="Ex. Red" />
                  <ItemSelect class="col-lg-6 px-2" label="Condition" v-model="formData.condition" :options="[
                    { value: 'New', text: 'New' },
                    { value: 'Excellent', text: 'Excellent' },
                    { value: 'Good', text: 'Good' },
                    { value: 'Average', text: 'Average' },
                    { value: 'Non-drivable', text: 'Non-drivable' },
                    { value: 'For parts only', text: 'For parts only' },
                  ]" />
                  <ItemInput class="col-lg-6 px-2" label="No.of Owners" v-model="formData.automotive_class"
                             placeholder="Ex. 1" maxLength="4" />
                  <PriceInput class="col-lg-6 px-2" label="Asking Price" v-model="formData.cost" maxLength="7"
                              placeholder="Ex. 12,000" />
                </div>
              </div>
              <h6>Specific Details</h6>
              <div class="fp-border-color-1 p-2 p-md-3 border round-12">
                <div class="row mx-n2">
                  <ItemInput class="col-lg-6 px-2" label="VIN #" v-model="formData.automotive_vin" maxLength="20"
                             placeholder="Ex. 1ZOSX543F4120" />
                  <ItemInput class="col-lg-6 px-2" label="Title" v-model="formData.automotive_title" maxLength="30"
                             placeholder="Ex. Clean" />
                  <ItemInput class="col-lg-6 px-2" label="Odometer" v-model="formData.automotive_odometer" maxLength="20"
                             placeholder="Ex. 112,000" />
                  <ItemInput class="col-lg-6 px-2" label="Transmission" v-model="formData.automotive_transmission"
                             maxLength="50" placeholder="Ex. Automatic" />
                  <ItemInput class="col-lg-6 px-2" label="MPG" v-model="formData.automotive_mpg" maxLength="30"
                             placeholder="Ex.25 City/ 30 Hwy" />
                  <ItemInput class="col-lg-6 px-2" label="Fuel Type" v-model="formData.automotive_fuel_type"
                             maxLength="30" placeholder="Ex. Regular" />
                  <ItemInput class="col-lg-6 px-2" label="Engine" v-model="formData.automotive_engine" maxLength="30"
                             placeholder="Ex. 4Cyl/ 2.0L" />
                  <ItemAdd class="col-lg-6 px-2" label="Features" v-model="formData.automotive_features"
                           placeholder="Ex. Back Camera" />
                  <div class="col-12 px-2 px-lg-5">
                    <div class="flex-wrap mt-2" style="flex-direction: row" v-show="formData.automotive_features &&
                      formData.automotive_features.length
                      ">
                      <span class="information-item" v-for="(item, index) in formData.automotive_features" :key="index">
                        {{ item }}
                        <fa icon="times" class="btn-remove" @click="removeFeature(item)" />
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div v-if="formData.automotive_category.name ===
              'Electric Vehicles/Inventions'
              " class="row mx-n2 mt-2">
              <ItemInput class="col-lg-6 px-2" label="For Sale" v-model="formData.automotive_item_name" maxLength="50"
                         placeholder="Ex. Electric Bike" required :hasError="hasError('automotive_item_name')" />
              <ItemSelect class="col-lg-6 px-2" label="Sale by" v-model="formData.sale_by" :options="[
                { value: 'Individual/Owner', text: '' },
                { value: 'Local Store', text: 'Local Store' },
                { value: 'Dealer', text: 'Dealer' },
                { value: 'Wholesale Market', text: 'Wholesale Market' },
                { value: 'Other', text: 'Other' },
              ]" />
              <ItemInput class="col-lg-6 px-2" label="Make" v-model="formData.automotive_make_manufacturer" maxLength="20"
                         placeholder="Ex. Make" />
              <ItemInput class="col-lg-6 px-2" label="Model" v-model="formData.automotive_model" maxLength="20"
                         placeholder="Ex. Model" />
              <ItemSelect class="col-lg-6 px-2" label="Condition" v-model="formData.condition" :options="[
                { value: 'New', text: 'New' },
                { value: 'Excellent', text: 'Excellent' },
                { value: 'Good', text: 'Good' },
                { value: 'Average', text: 'Average' },
                { value: 'Non-drivable', text: 'Non-drivable' },
                { value: 'For parts only', text: 'For parts only' },
              ]" />
              <PriceInput class="col-lg-6 px-2" label="Asking Price" v-model="formData.cost" maxLength="7"
                          placeholder="Ex. 2,099" />
              <ItemTextArea class="col-12 px-2" label="Additional Info" v-model="formData.business_hours" maxLength="150"
                            placeholder="Explan more details.." labelColClass="col-lg-2" inputColClass="col-lg-10" />
            </div>
            <div v-if="formData.automotive_category.name === 'Motorbikes/Scooters'
              " class="mt-2">
              <h6>Basic Details</h6>
              <div class="fp-border-color-1 p-2 p-md-3 border round-12 mb-4">
                <div class="row mx-n2">
                  <ItemInput class="col-lg-6 px-2" label="For Sale" v-model="formData.automotive_item_name" maxLength="50"
                             required :hasError="hasError('automotive_item_name')" placeholder="Ex. Kawasaki ZRX" />
                  <ItemInput class="col-lg-6 px-2" label="Make" v-model="formData.automotive_make_manufacturer"
                             maxLength="20" placeholder="Ex. Kawasaki" />
                  <ItemInput class="col-lg-6 px-2" label="Model/Serial Number" v-model="formData.automotive_model"
                             maxLength="20" placeholder="Ex. 1100 ZRX" />
                  <ItemInput class="col-lg-6 px-2" label="Year" v-model="formData.automotive_year" maxLength="4"
                             placeholder="Ex. 2001" />
                  <ItemInput class="col-lg-6 px-2" label="Color" v-model="formData.automotive_color" maxLength="20"
                             placeholder="Ex. Green" />
                  <ItemSelect class="col-lg-6 px-2" label="Condition" v-model="formData.condition" :options="[
                    { value: 'New', text: 'New' },
                    { value: 'Excellent', text: 'Excellent' },
                    { value: 'Good', text: 'Good' },
                    { value: 'Average', text: 'Average' },
                    { value: 'Non-drivable', text: 'Non-drivable' },
                    { value: 'For parts only', text: 'For parts only' },
                  ]" />
                  <ItemInput class="col-lg-6 px-2" label="Bike Type" v-model="formData.automotive_class"
                             placeholder="Ex. Sport" maxLength="20" />
                  <PriceInput class="col-lg-6 px-2" label="Asking Price" v-model="formData.cost" maxLength="7"
                              placeholder="Ex. 6,080" />
                </div>
              </div>
              <h6>Specific Details</h6>
              <div class="fp-border-color-1 p-2 p-md-3 border round-12">
                <div class="row mx-n2">
                  <ItemInput class="col-lg-6 px-2" label="VIN #" v-model="formData.automotive_vin" maxLength="30"
                             placeholder="Ex. 121ZOS676XN788120" />
                  <ItemInput class="col-lg-6 px-2" label="Title" v-model="formData.automotive_title" maxLength="30"
                             placeholder="Ex. Clean" />
                  <ItemInput class="col-lg-6 px-2" label="Odometer" v-model="formData.automotive_odometer" maxLength="20"
                             placeholder="Ex. 16500" />
                  <ItemInput class="col-lg-6 px-2" label="Transmission" v-model="formData.automotive_transmission"
                             maxLength="50" placeholder="Ex. Automatic" />
                  <ItemInput class="col-lg-6 px-2" label="MPG" v-model="formData.automotive_mpg" maxLength="30"
                             placeholder="Ex. 30 City/ 44 Hwy" />
                  <ItemInput class="col-lg-6 px-2" label="Fuel Type" v-model="formData.automotive_fuel_type"
                             maxLength="30" placeholder="Ex. Regular" />
                  <ItemInput class="col-lg-6 px-2" label="Engine" v-model="formData.automotive_engine" maxLength="30"
                             placeholder="Ex. 106HP/ 8700RPM" />
                  <ItemAdd class="col-lg-6 px-2" label="Features" v-model="formData.automotive_features"
                           placeholder="Ex. Navigation" />
                  <div class="col-12 px-2 px-lg-5">
                    <div class="flex-wrap mt-2" style="flex-direction: row" v-show="formData.automotive_features &&
                      formData.automotive_features.length
                      ">
                      <span class="information-item" v-for="(item, index) in formData.automotive_features" :key="index">
                        {{ item }}
                        <fa icon="times" class="btn-remove" @click="removeFeature(item)" />
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div v-if="formData.automotive_category.name === 'RV/Campers/Trailers'
              " class="mt-2">
              <h6>Basic Details</h6>
              <div class="fp-border-color-1 p-2 p-md-3 border round-12 mb-4">
                <div class="row mx-n2">
                  <ItemInput class="col-lg-6 px-2" label="For Sale" v-model="formData.automotive_item_name" maxLength="50"
                             required :hasError="hasError('automotive_item_name')" placeholder="Ex. RV" />
                  <ItemInput class="col-lg-6 px-2" label="Make" v-model="formData.automotive_make_manufacturer"
                             maxLength="20" placeholder="Ex. Keystone" />
                  <ItemInput class="col-lg-6 px-2" label="Model/Serial Number" v-model="formData.automotive_model"
                             maxLength="20" placeholder="Ex. Hideout LHS 243RB" />
                  <ItemInput class="col-lg-6 px-2" label="Year" v-model="formData.automotive_year" maxLength="4"
                             placeholder="Ex. 2022" />
                  <ItemInput class="col-lg-6 px-2" label="Color" v-model="formData.automotive_color" maxLength="20"
                             placeholder="Ex. White" />
                  <ItemSelect class="col-lg-6 px-2" label="Condition" v-model="formData.condition" :options="[
                    { value: 'New', text: 'New' },
                    { value: 'Excellent', text: 'Excellent' },
                    { value: 'Good', text: 'Good' },
                    { value: 'Average', text: 'Average' },
                    { value: 'Non-drivable', text: 'Non-drivable' },
                    { value: 'For parts only', text: 'For parts only' },
                  ]" />
                  <ItemInput class="col-lg-6 px-2" label="Class" v-model="formData.automotive_class"
                             placeholder="Ex. Travel Trailer" maxLength="20" />
                  <PriceInput class="col-lg-6 px-2" label="Asking Price" v-model="formData.cost" maxLength="10"
                              placeholder="Ex. 29,995" />
                </div>
              </div>
              <h6>Specific Details</h6>
              <div class="fp-border-color-1 p-2 p-md-3 border round-12">
                <div class="row mx-n2">
                  <ItemInput class="col-lg-6 px-2" label="VIN #" v-model="formData.automotive_vin" maxLength="30"
                             placeholder="Ex. 121ZOS676XN788120" />
                  <ItemInput class="col-lg-6 px-2" label="Gross Weight" v-model="formData.automotive_title" maxLength="30"
                             placeholder="Ex. 5,975LB" />
                  <ItemInput class="col-lg-6 px-2" label="Sleeping Capacity" v-model="formData.automotive_overall_weight"
                             maxLength="30" placeholder="Ex. Sleeps 4 people" />
                  <ItemInput class="col-lg-6 px-2" label="Air Condition" v-model="formData.automotive_odometer"
                             maxLength="20" placeholder="Ex. Yes" />
                  <ItemInput class="col-lg-6 px-2" label="Total Length" v-model="formData.automotive_dimensions"
                             maxLength="50" placeholder="Ex. 28 ft" />
                  <ItemInput class="col-lg-6 px-2" label="Self Contained" v-model="formData.automotive_mpg" maxLength="30"
                             placeholder="Ex. No" />
                  <ItemInput class="col-lg-6 px-2" label="Floor Plan" v-model="formData.automotive_fuel_type"
                             maxLength="30" placeholder="Ex. Yes" />
                  <ItemInput class="col-lg-6 px-2" label="Awnings" v-model="formData.automotive_assist" maxLength="30"
                             placeholder="Ex. 1" />
                  <ItemInput class="col-lg-6 px-2" label="Generator" v-model="formData.automotive_engine" maxLength="30"
                             placeholder="Ex. No" />
                  <ItemAdd class="col-lg-6 px-2" label="Features" v-model="formData.automotive_features"
                           placeholder="Ex. TV" />
                  <div class="col-12 px-2 px-lg-5">
                    <div class="flex-wrap mt-2" style="flex-direction: row" v-show="formData.automotive_features &&
                      formData.automotive_features.length
                      ">
                      <span class="information-item" v-for="(item, index) in formData.automotive_features" :key="index">
                        {{ item }}
                        <fa icon="times" class="btn-remove" @click="removeFeature(item)" />
                      </span>
                    </div>
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
            <fp-uploader v-model="formData.images" :url="uploadImageUrl" :remove-url="removeImageUrl"
                         @removed="imageRemoved" />
            <div class="text-center mt-3" v-if="progress && formData.images">
              <div class="progress mx-auto" style="height: 8px">
                <div class="progress-bar progress-bar-striped progress-bar-animated" :style="{ width: `${progress}%` }">
                </div>
              </div>
              <p class="mt-1">
                {{ progress }}% uploaded... please wait
              </p>
            </div>
          </div>
        </div>
      </tab-content>
      <tab-content v-if="!formData.automotive_seller" title="Location & Contact">
        <div class="row justify-content-center">
          <div class="col-lg-9">
            <div class="fp-card form-step-content">
              <div class="row mx-n2">
                <div class="col-lg-6 px-2">
                  <h6 class="text-center text-md-left">Choose Location</h6>
                  <div class="fp-border-color-1 p-2 p-md-3 border round-10">
                    <div class="form-group">
                      <label class="mb-2">Address </label>
                      <gmap-autocomplete class="form-control w-100" :value="formData.address"
                                         @place_changed="updateAddress" placeholder="Enter street address(Optional)"
                                         style="max-width: 100%" @keypress.enter="$event.preventDefault()"
                                         :options="gmapAutocompleteOptions" />
                    </div>
                    <div class="row mx-n1">
                      <div class="col-md-6 px-1 mb-3">
                        <label class="mb-2">Zip Code <sup class="text-danger">*</sup></label>
                        <gmap-autocomplete class="form-control w-100" :value="formData.zipcode"
                                           @place_changed="updateAddress" @input="formData.zipcode = $event.target.value"
                                           placeholder="Enter zip/city" style="max-width: 100%"
                                           :options="gmapAutocompleteOptions"></gmap-autocomplete>
                        <div v-if="hasError('zipcode')" class="text-danger">
                          <div class="error" v-if="!$v.formData.zipcode.required">
                            Zip Code is required.
                          </div>
                          <div class="error" v-if="!$v.formData.zipcode.numeric">
                            Zip Code must be numbers.
                          </div>
                          <div class="error" v-if="!$v.formData.zipcode.maxLength">
                            Max 9 digits allowed.
                          </div>
                        </div>
                      </div>
                      <div class="col-md-6 px-1 mb-3">
                        <label class="mb-2">City <sup class="text-danger">*</sup></label>
                        <input type="text" class="form-control" v-model="formData.city" placeholder="Enter city"
                               readonly />
                        <div v-if="hasError('city')" class="text-danger">
                          <div class="error" v-if="!$v.formData.city.required">
                            City is required
                          </div>
                        </div>
                      </div>
                      <div class="col-md-12 px-1">
                        <label class="mb-2">State <sup class="text-danger">*</sup></label>
                        <input type="text" class="form-control" v-model="formData.state" placeholder="Enter state"
                               readonly />
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
                  <h6 class="text-center text-md-left">Contact Details</h6>
                  <div class="fp-border-color-1 p-2 p-md-3 border round-10 contact-details-input">
                    <div class="form-group">
                      <label class="mb-2">Email</label>
                      <input type="email" class="form-control" v-model="formData.contact_email" maxlength="100"
                             placeholder="Email (Recommended)" />
                    </div>
                    <div class="form-group">
                      <label for="" class="mb-2">Phone</label>
                      <input type="text" class="form-control" v-model="formData.contact_phone_number" maxlength="50"
                             placeholder="Phone (Optional)" />
                    </div>
                    <div class="form-group">
                      <label for="" class="mb-2">Web Link</label>
                      <input type="text" class="form-control" v-model="formData.contact_weblink" maxlength="300"
                             placeholder="Any web links (Optional)" />
                    </div>
                    <div class="d-flex justify-content-between">
                      <div class="d-inline-flex custom-control custom-checkbox">
                        <input v-model="formData.enable_chat" type="checkbox" class="custom-control-input"
                               id="enable_chat" />
                        <label class="custom-control-label" for="enable_chat">Chat</label>
                      </div>
                      <div class="d-inline-flex custom-control custom-checkbox ml-auto">
                        <input v-model="formData.no_reply_to_this_post" type="checkbox" class="custom-control-input"
                               id="no_reply_to_this_post" />
                        <label class="custom-control-label" for="no_reply_to_this_post">No reply to this post</label>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="col-12 px-2">
                  <div class="border fp-border-color-1 round-10 overflow-hidden mt-3"
                       style="height: calc(100% - 35px); min-height: 300px">
                    <GmapMap ref="mapRef" :options="{
                      mapTypeControl: false,
                      streetViewControl: false,
                    }" :center="map_center" :zoom="11" map-type-id="roadmap" style="width: 100%; height: 100%">
                      <GmapCircle :center="{
                        lat: Number(formData.location.latitude),
                        lng: Number(formData.location.longitude),
                      }" :radius="7000" :visible="true" :editable="true" :options="{
  fillColor: 'green',
  fillOpacity: 0.3,
  strokeColor: 'green',
  strokeOpacity: 0.5,
  strokeWeight: 2,
}" />
                    </GmapMap>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </tab-content>
      <tab-content title="Submit">
        <div>
          <h6 style="font-weight: 500">{{ formData.title }}</h6>
          <PostDetail :post="formData" />
          <!-- <div v-if="profile.image.length" class="carousel">
        <div class="indicator">
          <img v-for="(image, index) in profile.image" :src="image.src_url" :key="index" @click="changeCarousel(index)"
               :class="{ active: indexOfImage == index }" alt="" />
        </div>
        <div class="slider">
          <VueSlickCarousel ref="carousel" v-bind="slickSettings" @afterChange="afterChange">
            <div class="text-center" v-for="(img, index) in profile.image" :key="index" @click="openGallery(index)">
              <img class="slider-img img-slide mx-auto" :src="img.src_url" alt="" />
            </div>
          </VueSlickCarousel>
        </div>
      </div>

      <div class="md-slide">
        <div v-if="profile.image.length" class="m-indicator mt-2">
          <img v-for="(image, index) in profile.image" :src="image.src_url" :key="index" @click="changeCarousel(index)"
               :class="{ active: indexOfImage == index }" alt="" />
        </div>
        <div v-if="post" class="fp-card user-detail-container p-2 mt-3">
          <post-user-detail :post="post" />
        </div>
      </div> -->
          <div class="mt-3 text-center">
            <div class="custom-control custom-checkbox">
              <input type="checkbox" class="custom-control-input"
                     :class="{ invalid: !formData.isAccepted && clicked_submit }" id="is_accepted" name="accept"
                     v-model="formData.isAccepted" />
              <label class="custom-control-label fp-text-color-main" for="is_accepted">I have read and accept the
                <a href="/learn/terms_of_use" class="fp-text-active" target="_blank">Terms of use</a>
                and
                <a href="/learn/privacy_policies" class="fp-text-active" target="_blank">Privacy policy</a></label>
            </div>
          </div>

          <!-- loader view start -->

          <div class="fp-loading" v-if="loading">
            <img src="@/assets/images/logo_loading.gif" width="100" height="100" alt="" />
            <div class="progress mt-3 mt-md-4">
              <div class="progress-bar bg-success" :style="{ width: `${this.progress}%` }">
                {{ this.progress }}%
              </div>
            </div>
          </div>
          <!-- loader view end -->
        </div>
      </tab-content>
    </form-wizard>

    <portal to="mobile-page-title">
      <h6 class="mb-0 mobile-page-title">{{ pageTitle }}</h6>
    </portal>
  </div>
</template>
<script>
import { FormWizard, TabContent, ValidationHelper } from "vue-step-wizard";
import "vue-step-wizard/dist/vue-step-wizard.css";
import { required, numeric, maxLength } from "vuelidate/lib/validators";
import { mapGetters } from "vuex";
import "vue-slick-carousel/dist/vue-slick-carousel.css";
import "vue-slick-carousel/dist/vue-slick-carousel-theme.css";
import VueSlickCarousel from "vue-slick-carousel";
import PostDetail from "~/components/ads/PostDetail.vue";
import ItemInput from "~/components/ads/form_elements/Input.vue";
import PriceInput from "~/components/ads/form_elements/PriceInput.vue";
import ItemSelect from "~/components/ads/form_elements/Select.vue";
import ItemTextArea from "~/components/ads/form_elements/TextArea.vue";
import ItemAdd from "~/components/ads/form_elements/ItemAdd.vue";
import FpUploader from "~/components/ads/form_elements/Uploader.vue";
import Uploading from "../elements/Uploading.vue";
import Swal from "sweetalert2";
export default {
  name: "AutomotiveInventoryForm",
  props: ["mode", "id", "hasSellerProfile"],
  mixins: [ValidationHelper],
  components: {
    FormWizard,
    VueSlickCarousel,
    TabContent,
    PostDetail,
    ItemInput,
    ItemSelect,
    ItemTextArea,
    ItemAdd,
    PriceInput,
    FpUploader,
    Uploading,
  },
  data() {
    let validationRules = [
      { automotive_category: { required } },
      { title: { required } },
      { automotive_item_name: { required } },
      {},
      {
        zipcode: { required, numeric, maxLength: maxLength(9) },
        city: { required },
        state: { required },
      },
      {},
    ];
    if (this.hasSellerProfile) {
      validationRules = [
        { automotive_category: { required } },
        { title: { required } },
        { automotive_item_name: { required } },
        {},
        {},
      ];
    }
    return {
      categories: [],
      isSellerProfile: false,
      formData: {
        id: "",
        automotive_seller_id: "",
        automotive_seller: "",
        user_id: null,
        user: null,
        automotive_category: "",
        automotive_category_id: "",
        automotive_sub_category_id: "",
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
          latitude: "32.9184763",
          longitude: "-117.1382404",
        },
        address: "",
        full_address: "",
        zipcode: "",
        city: "",
        state: "",

        condition: "",
        cost: "",
        business_hours: "",
        sale_by: "",
        automotive_item_name: "",
        automotive_make_manufacturer: "",
        automotive_model: "",
        automotive_year: "",
        automotive_color: "",
        automotive_odometer: "",
        automotive_is_negotiable: false,
        automotive_vin: "",
        automotive_features: [],
        automotive_title: "",
        automotive_transmission: "",
        automotive_mpg: "",
        automotive_fuel_type: "",
        automotive_engine: "",

        // Added fields
        automotive_class: "",
        automotive_dimensions: "",
        automotive_wheel_size: "",
        automotive_overall_weight: "",
        automotive_assist: "",
        automotive_fuel_tank: "",
        automotive_speed: "",
        automotive_engine_make: "",
        automotive_make_year: "",
        automotive_total_power: "",
        automotive_engine_type: "",
        automotive_drive_type: "",
        automotive_propeller_type: "",

        images: [],
        diff_time: "just now",
        isAccepted: false,
      },
      isSubCategoryUpdate: false,
      step: 1,
      last_step: 5,
      form_submitted: false,
      validationRules: validationRules,
      uploadImageUrl: `${process.env.adsApiUrl}/post/upload_image`,
      removeImageUrl: `${process.env.adsApiUrl}/post/image/delete/`,
      uploading: false,
      clicked_submit: false,
      map_center: { lat: 32.9184763, lng: -117.1382404 },
      profileLoaded: false,
      loading: false,
      progress: 0,
      gmapAutocompleteOptions: {
        componentRestrictions: { country: ["us", "ca"] },
      },
      sliderSettings: {
        slidesToScroll: 1,
        variableWidth: true,
        responsive: [
          {
            breakpoint: 1024,
            settings: {
              arrows: true,
              slidesToScroll: 1,
              variableWidth: true,
            },
          },
          {
            breakpoint: 900,
            settings: {
              arrows: true,
              slidesToScroll: 1,
              variableWidth: true,
            },
          },
          {
            breakpoint: 480,
            settings: {
              arrows: true,
              slidesToScroll: 1,
              variableWidth: true,
            },
          },
        ],
        // centerPadding: "10px",
      },
    };
  },
  computed: {
    description_chars: function () {
      if (!this.formData.description) return 0;
      return this.formData.description.length;
    },
    pageTitle() {
      if (this.storeState.currentTab === 0) return "Select Category";
      if (this.storeState.currentTab === 1) return "Post Details";
      if (this.storeState.currentTab === 2) return "Quick Info(Optional)";
      if (this.storeState.currentTab === 3) return "Gallery";
      if (!this.formData.automotive_seller && this.storeState.currentTab === 4)
        return "Location & Contact";
      return "Submit";
    },
    ...mapGetters({
      auth_user: "auth/user",
      authenticated: "auth/check",
      previewImages: "ads/previewImages",
    }),
  },
  watch: {
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
  },
  async mounted() {
    await this.init();
    if (this.mode == "edit") {
      await this.loadPost();
    }
    this.formData.user_id = this.auth_user ? this.auth_user.id : null;
    this.formData.user = this.auth_user;
  },
  methods: {
    async init() {
      this.axios
        .post(`${process.env.adsApiUrl}/automotive/get_categories`, {
          mode: "profile",
        })
        .then((response) => {
          console.log(response)
          this.categories = response.data.data;
        });
      this.profileLoaded = false;
      const response = await this.axios.post(
        `${process.env.adsApiUrl}/automotive/get_seller_profile`,
        { user_id: this.auth_user.id }
      );
      let seller = response.data.data;
      if (seller) {
        this.isSellerProfile = true;
        this.formData.automotive_seller = seller;
        this.formData.automotive_seller_id = seller.id;
        this.formData.contact_email = seller.email;
        this.formData.contact_phone_number = seller.phone_number;
        this.formData.contact_weblink = seller.weblink;
        this.formData.enable_chat = seller.enable_chat;

        this.formData.location = seller.location;
      } else {
        this.formData.contact_email = this.auth_user.email;
        this.formData.contact_phone_number = this.auth_user.phone_number;
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
          this.last_step = 6;

          this.validationRules = [
            {},
            { title: { required } },
            { automotive_item_name: { required } },
            {},
            {
              zipcode: { required, numeric, maxLength: maxLength(9) },
              city: { required },
              state: { required },
            },
            {},
          ];
        }
      }
      await this.$nextTick();
      this.profileLoaded = true;
    },
    async loadPost() {
      const response = await this.axios.post(
        `${process.env.adsApiUrl}/post/get_detail`,
        { id: this.id }
      );
      let post = response.data.data;
      this.formData = {
        id: post.id,
        automotive_category: post.automotive_category,
        automotive_category_id: post.automotive_category_id,
        title: post.title,
        description: post.description,
        contact_email: post.contact_email,
        contact_phone_number: post.contact_phone_number,
        contact_weblink: post.contact_weblink,
        enable_chat: post.enable_chat,
        location: post.location,
        address: post.location.address,
        full_address: post.location.full_address,
        zipcode: post.location.zipcode,
        city: post.location.city,
        state: post.location.state,
        condition: post.condition,
        cost: post.cost,
        sale_by: post.sale_by,
        business_hours: post.business_hours,
        automotive_seller: post.automotive_seller,
        automotive_seller_id: post.automotive_seller_id,
        automotive_item_name: post.automotive_item_name,
        automotive_make_manufacturer: post.automotive_make_manufacturer,
        automotive_is_negotiable: post.automotive_is_negotiable,
        automotive_model: post.automotive_model,
        automotive_year: post.automotive_year,
        automotive_color: post.automotive_color,
        automotive_odometer: post.automotive_odometer,
        automotive_vin: post.automotive_vin,
        automotive_features: post.automotive_features,
        automotive_title: post.automotive_title,
        automotive_transmission: post.automotive_transmission,
        automotive_mpg: post.automotive_mpg,
        automotive_fuel_type: post.automotive_fuel_type,
        automotive_engine: post.automotive_engine,

        automotive_class: post.automotive_class,
        automotive_dimensions: post.automotive_dimensions,
        automotive_wheel_size: post.automotive_wheel_size,
        automotive_overall_weight: post.automotive_overall_weight,
        automotive_assist: post.automotive_assist,
        automotive_fuel_tank: post.automotive_fuel_tank,
        automotive_speed: post.automotive_speed,
        automotive_engine_make: post.automotive_engine_make,
        automotive_make_year: post.automotive_make_year,
        automotive_total_power: post.automotive_total_power,
        automotive_engine_type: post.automotive_engine_type,
        automotive_drive_type: post.automotive_drive_type,
        automotive_propeller_type: post.automotive_propeller_type,

        images: post.images,
        isAccepted: false,
        no_reply_to_this_post: post.no_reply_to_this_post,
      };
      console.log("formdata")
      console.log(this.formData)
    },
    selectCategory(item) {
      if (item && this.formData.automotive_category_id == item.id) {
        this.formData.automotive_category = null;
        this.formData.automotive_category_id = null;
      } else {
        this.formData.automotive_category = item;
        this.formData.automotive_category_id = item.id;
      }
    },
    selectSubCategory(item) {
      this.formData.automotive_sub_category_id = item.id;
    },
    addFeature() {
      let feature = this.$refs.feature_form.value;
      this.formData.automotive_features.push(feature);
      this.$refs.feature_form.value = "";
    },
    removeFeature(item) {
      let index = this.formData.automotive_features.indexOf(item);
      this.formData.automotive_features.splice(index, 1);
    },
    previousStep() {
      this.step--;
    },
    goToPreviousStep() {
      document.querySelector(".step-button.step-button-previous").click();
    },
    imageUploaded(image) {
      this.formData.images.push(image);
    },
    imageRemoved(index) {
      this.formData.images.splice(index, 1);
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

      // logic to upload images

      const uploadedImages = [];
      const totalImages = this.previewImages.length;
      let count = 0;
      for (const image of this.previewImages) {
        const uploadedImage = await this.uploadImage(image);
        uploadedImages.push(uploadedImage);
        count++;
        this.progress = Math.floor((count / totalImages) * 100);
        console.log("progress", this.progress)
        // this.$refs.progresStatus.style.width = this.progress + "%";
      }

      this.formData.images = uploadedImages;
      this.loading = false;

      // logic to upload images end

      const response = await this.axios.post(uri, this.formData);
      this.loading = false;
      if (response.data.status == "Success") {
        let result = response.data.data;
        this.formData.id = result.id;
        this.form_submitted = true;
        this.$store.commit("ads/CLEAR_PREVIEW_IMAGES");
        if (this.mode === "edit" || this.formData.automotive_seller_id) {
          this.$router.push({
            name: "automotive.seller_profile",
            params: { slug: this.formData.automotive_seller.slug },
          });
        } else {
          this.$router.push({
            name: "ads.activate",
            query: { id: result.id, email: result.contact_email },
          });
        }
      }
      this.$store.dispatch("fetchNotifications");
    },
    async removeSubCategory(item) {
      const id = item.id;
      const response = await this.axios.delete(
        `${process.env.adsApiUrl}/automotive/sub_category/delete/${id}`
      );

      if (response?.data?.status == "Success") {
        Swal.fire({
          icon: "success",
          title: "Deleted",
          text: "Sub category deleted successfully",
        });
        this.reload();
      }
    },
    editSubCategory(item) {
      this.isSubCategoryUpdate = true;
      this.formData.automotive_sub_category_id = item.id;
      this.$refs.subcatSubmitbtn.innerText = "Update";
      this.$refs.subCatName.value = item.name;
    },
    reload() {
      if (this.mode === "add") {
        window.location.reload();
      } else {
        this.$router.push({ name: "automotive.create" });
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
    changeNoReply(event) {
      if (event.target.checked) {
        this.formData.contact_email = "";
        this.formData.contact_phone_number = "";
        this.formData.contact_weblink = "";
        this.formData.enable_chat = false;
      }
    },
    async saveSubCategory() {
      if (!this.formData.automotive_category) {
        return this.$fpError("Please select category first!");
      }
      try {
        const postData = {
          automotive_category_id: this.formData.automotive_category_id,
          name: this.$refs.subCatName.value,
        };
        let response;
        if (this.isSubCategoryUpdate) {
          response = await this.axios.post(
            `${process.env.adsApiUrl}/automotive/sub_category/update/${this.formData.automotive_sub_category_id}`,
            postData
          );
          this.isSubCategoryUpdate = false;
          this.$refs.subcatSubmitbtn.innerText = "Save";
        } else {
          response = await this.axios.post(
            `${process.env.adsApiUrl}/automotive/sub_category/save`,
            postData
          );
        }
        if (response.data.status === "Success") {
          const sub_category = response.data.data;
          const index = this.categories.findIndex(
            (i) => i.id === this.formData.automotive_category_id
          );
          if (this.isEditing) {
            const subCatIndex = this.categories[index].sub_categories.findIndex(
              (sc) => sc.id === sub_category.id
            );
            this.$set(
              this.categories[index].sub_categories,
              subCatIndex,
              sub_category
            );
          } else {
            this.categories[index].sub_categories.push(sub_category);
            this.formData.automotive_sub_category_id = sub_category.id;
          }

          this.$refs.subCatName.value = "";
          this.$refs.subcatSubmitbtn.innerText = "Add";
          this.isEditing = false;
        }
      } catch (error) { }
    },
  },
};
</script>
<style lang="scss" scoped>
.form-content {
  width: 100%;
  margin: 0 auto;
  display: flex;
  justify-content: center;

  @media (max-width: 991px) {
    width: 100%;
  }

  .step-card {
    width: 900px;

    @media (max-width: 991px) {
      width: 100%;
    }
  }
}

.category-container {
  display: flex;
  /* flex-direction: column; */
  gap: .2em;
  width: 40%;

  @media (max-width: 991px) {
    width: 100%;
  }

  @media (max-width: 600px) {
    display: flex;
    flex-direction: column;
  }
}

.sub-category-container {
  display: flex;
  flex-direction: column;
  width: 60%;

  form {
    display: flex;
    justify-content: center;

    gap: 1em;

    button {
      min-width: 85px;
    }

    input {
      width: 100%;
    }
  }

  @media (max-width: 991px) {
    width: 100%;
  }
}

.form-step-content {
  justify-content: center;
  gap: 2em;
  padding: 1.5em 2em;

  @media (max-width: 991px) {
    padding: 1.5em 2em;
  }

  @media (max-width: 769px) {
    padding: 1.5em 2em;
  }

  @media (max-width: 600px) {
    padding: 0;
    border-radius: 0;
    background: none;
  }
}

.step-title {
  text-align: center;
}

.sub-title {
  font-size: 18px;
}

.col-form-label {
  font-size: 14.4px;
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
  margin-right: 5px;
  margin-bottom: 5px;
  font-size: 14.4px;
  font-weight: 400;
  border-radius: 6px;

  .btn-remove {
    margin-left: 5px;
    cursor: pointer;
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
    margin: 0 60px;
    border: none;
    border-radius: 0;
    box-shadow: none !important;
    background: none;

    @media (max-width: 767px) {
      margin-inline: 40px;
    }

    @media (max-width: 600px) {
      margin: 0px;
    }
  }

  .step-button {
    border-radius: 3px;

    &.step-button-next,
    &.step-button-submit {
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

.content-group {
  display: flex;
  gap: 1em;
  border: solid 1px #64748b;
  border-radius: .5em;
  margin-right: .5em;
  margin-bottom: .5em;
  padding: .5em .75em;
  color: #8598B2 !important;
}

.form-submitted::v-deep {
  .step-footer {
    display: none;
  }
}

.post {
  &>:last-child {
    display: none;
  }

  @media (max-width: 991px) {
    &>:last-child {
      display: block;
    }
  }
}

.post-category {
  display: flex;
  flex-direction: column;
  gap: .5em;

  @media (max-width: 991px) {
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

  /* &::v-deep .slick-slide {
    margin-right: 7px !important;
  } */
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

.category-container {
  display: flex;

  @media (max-width: 991px) {
    width: 100%;
  }

  @media (max-width: 600px) {
    width: 100%;
    flex-wrap: wrap;
    overflow: auto;
  }

  .category.button-view {
    font-weight: 500;
  }
}

.fp-text-default.category.button-view.mr-lg-0 {
  margin: 10px;

  @media (max-width: 600px) {
    margin: .3em 0em;
  }
}

.category.button-view {
  margin: 0;
}
</style>
