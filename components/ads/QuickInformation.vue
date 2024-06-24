<template>
    <div class="pr-2">
        <h5 class="sub-title mb-3">
            {{ post.category && post.category.name === 'Community' ? 'Quick Comments' : 'Quick Information'}}
        </h5>
        <template v-if="post.category && !post.automotive_item_name">
            <div v-if="post.category.name == 'For Sale'">
                <div
                    v-if="
                        post.job_title
                        || post.sale_by
                        || post.condition
                        || post.cost
                        || post.model
                        || post.manufacturer
                        || post.business_hours
                    "
                >
                    <div class="row mb-3 mx-n1">
                        <div class="col-12 px-1">
                            <span v-if="post.job_title" class="service-item">{{post.job_title}}</span>
                            <span v-if="post.sale_by" class="service-item"><strong>Sale by:</strong> {{post.sale_by}}</span>
                            <span v-if="post.condition" class="service-item"><strong>Condition: </strong>{{post.condition}}</span>
                            <span v-if="post.cost" class="service-item"><strong>Price:</strong> {{_currency(post.cost)}}</span>
                            <span v-if="post.manufacturer" class="service-item"><strong>Make:</strong> {{post.manufacturer}}</span>
                            <span v-if="post.model" class="service-item"><strong>Model:</strong> {{post.model}}</span>
                        </div>
                    </div>
                    <div class="row mb-3 mx-n1" v-if="post.business_hours">
                        <div class="col-12 px-1"><h6 class="mb-2">Business Hours</h6></div>
                        <div class="col-12 px-1"><p class="info-description">{{post.business_hours}}</p></div>
                    </div>
                </div>
                <div class="fp-text-color-main" v-else>
                    <span class="ml-4">Not provided</span>
                </div>
            </div>
            <div v-else-if="post.category.name == 'Jobs'">
                <div
                    v-if="
                        post.job_title
                        || post.client_recruiter
                        || post.employement_types && post.employement_types.length
                        || post.compensation
                        || post.interview_mode
                        || post.benefits && post.benefits.length
                        || post.work_authorizations && post.work_authorizations.length
                    "
                >
                    <div class="row mb-3 mx-n1" v-if="post.job_title">
                        <div class="col-4 px-1"><h6 class="text-md-right mb-md-0">Job title</h6></div>
                        <div class="col-8 px-1"><h6 class="mb-0"><span class="service-item">{{post.job_title}}</span></h6></div>
                    </div>
                    <div class="row mb-3 mx-n1" v-if="post.client_recruiter">
                        <div class="col-4 px-1"><h6 class="text-md-right mb-md-0">Client or recruiter</h6></div>
                        <div class="col-8 px-1"><h6 class="mb-0"><span class="service-item">{{post.client_recruiter}}</span></h6></div>
                    </div>
                    <div class="row mb-3 mx-n1" v-if="post.employement_types && post.employement_types.length">
                        <div class="col-4 px-1"><h6 class="text-md-right mb-md-0">Job type</h6></div>
                        <div class="col-8 px-1"><h6 class="mb-0"><span class="service-item">{{post.employement_types.join(', ')}}</span></h6></div>
                    </div>
                    <div class="row mb-3 mx-n1" v-if="post.compensation">
                        <div class="col-4 px-1"><h6 class="text-md-right mb-md-0">Compensation</h6></div>
                        <div class="col-8 px-1"><h6 class="mb-0"><span class="service-item">${{post.compensation}}\{{post.compensation_unit}}</span></h6></div>
                    </div>
                    <div class="row mb-3 mx-n1" v-if="post.interview_mode">
                        <div class="col-4 px-1"><h6 class="text-md-right mb-md-0">Interview mode</h6></div>
                        <div class="col-8 px-1">
                            <h6 class="mb-0"><span class="service-item">{{post.interview_mode}}</span></h6>
                        </div>
                    </div>
                    <div class="row mb-3 mx-n1" v-if="post.remote_work_from_home">
                        <div class="col-4 px-1"><h6 class="text-md-right mb-md-0">Remote or work from home available?</h6></div>
                        <div class="col-8 px-1">
                            <h6 class="mb-0"><span class="service-item">{{post.remote_work_from_home}}</span></h6>
                        </div>
                    </div>
                    <div class="row mb-3 mx-n1" v-if="post.benefits && post.benefits.length">
                        <div class="col-4 px-1"><h6 class="text-md-right mb-md-0">Benefits</h6></div>
                        <div class="col-7 fp-text-color-main font-weight-bold">
                            {{ post.benefits.join(', ') }}
                        </div>
                    </div>
                    <div class="row mb-3 mx-n1" v-if="post.work_authorizations && post.work_authorizations.length">
                        <div class="col-4 px-1"><h6 class="text-md-right mb-md-0">Work permit</h6></div>
                        <div class="col-7 fp-text-color-main font-weight-bold">
                            {{ post.work_authorizations.join(', ') }}
                        </div>
                    </div>
                </div>
                <div class="fp-text-color-main" v-else>
                    <span class="ml-4">Not provided</span>
                </div>
            </div>
            <div v-else-if="post.category.name == 'Accommodation'">
                <div
                    v-if="
                        post.house_type
                        || post.bed_rooms
                        || post.bath_rooms
                        || post.furnished
                        || post.property_area
                        || post.rent_other_utilities
                        || post.stay_available_for && post.stay_available_for.length
                        || post.pets_allowed
                        || post.pet_characteristics
                        || post.smoking_allowed
                        || post.accommodation_amenities && post.accommodation_amenities.length
                        || post.accommodation_properties && post.accommodation_properties.length
                    "
                >
                    <div class="row mb-2 mx-n1">
                        <div class="col-12 px-1">
                            <span v-if="post.house_type" class="service-item">{{post.house_type}}</span>
                            <span v-if="post.bed_rooms" class="service-item">{{post.bed_rooms}}</span>
                            <span v-if="post.bath_rooms" class="service-item">{{post.bath_rooms}}</span>
                            <span v-if="post.furnished" class="service-item">{{post.furnished}}</span>
                            <span v-if="post.property_area" class="service-item">Area: {{post.property_area}}</span>
                            <span v-if="post.rent_other_utilities" class="service-item">{{_currency(post.rent_other_utilities)}}/{{post.rent_other_utilities_unit}}</span>
                            <span v-if="post.stay_available_for && post.stay_available_for.length" class="service-item">Available for: {{ post.stay_available_for.join(', ') }}</span>
                            <span v-if="post.smoking_allowed" class="service-item">
                                Smoking
                                <span v-if="post.smoking_allowed === 'Yes'">allowed</span>
                                <span v-if="post.smoking_allowed === 'No'">not allowed</span>
                                <span v-if="post.smoking_allowed === 'Outside only'">outside only</span>
                            </span>
                            <span v-if="post.pets_allowed" class="service-item">Pets {{post.pets_allowed == 'Yes' ? 'allowed' : 'not allowed'}}</span>
                            <span v-if="post.pets_allowed === 'Yes' && post.pet_characteristics" class="service-item">{{ post.pet_characteristics }}</span>
                            <span v-if="post.available_from" class="service-item">Available from: {{$moment(post.available_from).format('MM/DD/YYYY') }}</span>
                        </div>
                    </div>
                    <div class="row mb-3 mx-n1" v-if="post.accommodation_amenities && post.accommodation_amenities.length">
                        <div class="col-12 px-1">
                            <h6 class="mb-2">Amenities</h6>
                            <div class="flex-wrap" style="flex-direction: row;">
                                <span class="service-item" v-for="(item, index) in post.accommodation_amenities" :key="index">
                                    {{item}}
                                </span>
                            </div>
                        </div>
                    </div>
                    <div class="row mb-3 mx-n1" v-if="post.accommodation_properties && post.accommodation_properties.length">
                        <div class="col-12 px-1">
                            <h6 class="mb-3">Near by</h6>
                            <div class="flex-wrap" style="flex-direction: row;">
                                <span class="service-item" v-for="(item, index) in post.accommodation_properties" :key="index">
                                    {{item}}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="fp-text-color-main" v-else>
                    <span class="ml-4">Not provided</span>
                </div>
            </div>
            <div v-else-if="post.category.name == 'Real Estate'">
                <div
                    v-if="
                        post.house_type
                        || post.property_area
                        || post.cost
                        || post.accommodation_properties && post.accommodation_properties.length
                        || post.accommodation_amenities && post.accommodation_amenities.length
                    "
                >
                    <div class="row mb-3 mx-n1">
                        <div class="col-12 px-1">
                            <span v-if="post.house_type" class="service-item">{{post.house_type}}</span>
                            <template v-if="post.sub_category && ['Single/Multi Family Homes', 'Independent Houses/ Villas', 'Swap Properties', 'Condos/ Townhouse/ Studio', 'Bank/ Foreclosures', 'Government/ Auction', 'New/ Coming Soon'].includes(post.sub_category.name)">
                                <span v-if="post.furnished" class="service-item">{{post.furnished}}</span>
                                <span v-if="post.bed_rooms" class="service-item">{{post.bed_rooms}}</span>
                            </template>
                            <span v-if="post.property_area" class="service-item">Area: {{Number(post.property_area).toLocaleString()}} {{post.property_area_unit}}</span>
                            <span v-if="post.cost && !isNaN(post.cost)" class="service-item">Asking price: {{_currency(post.cost)}}</span>
                        </div>
                    </div>
                    <div class="row mb-3 mx-n1" v-if="post.location">
                        <div class="col-12 px-1">
                            <h6 class="mb-md-0">
                                Property Location &nbsp;
                                <span class="fp-text-color-main text-underline" style="font-size: 14.4px;">{{post.location.full_address}}</span>
                            </h6>
                        </div>
                    </div>
                    <div class="row mb-3 mx-n1" v-if="post.accommodation_amenities && post.accommodation_amenities.length">
                        <div class="col-12 px-1">
                            <h6 class="mb-2">Amenities/ Features</h6>
                            <div class="flex-wrap" style="flex-direction: row;">
                                <span class="service-item" v-for="(item, index) in post.accommodation_amenities" :key="index">
                                    {{item}}
                                </span>
                            </div>
                        </div>
                    </div>
                    <div class="row mb-3 mx-n1" v-if="post.accommodation_properties && post.accommodation_properties.length">
                        <div class="col-12 px-1">
                            <h6 class="mb-2">Near by</h6>
                            <div class="flex-wrap" style="flex-direction: row;">
                                <span class="service-item" v-for="(item, index) in post.accommodation_properties" :key="index">
                                    {{item}}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="fp-text-color-main" v-else>
                    <span class="ml-4">Not provided</span>
                </div>
            </div>
            <div v-else-if="post.category.name == 'Legal/Lawyers'">
                <div
                    v-if="
                        post.service_provider
                        || post.business_hours
                        || post.services && post.services.length
                        || post.license
                    "
                >
                    <div class="row mb-3 mx-n1" v-if="post.service_provider">
                        <div class="col-12 px-1"><h6 class="mb-2">Legal firm/Lawyer name</h6></div>
                        <div class="col-12 px-1"><h6 class="info-description">{{post.service_provider}}</h6></div>
                    </div>
                    <div class="row mb-3 mx-n1" v-if="post.license">
                        <div class="col-4 px-1"><h6 class="mb-0">License Info</h6></div>
                        <div class="col-8 px-1"><p class="mb-0">{{post.license}}</p></div>
                    </div>
                    <div class="row mb-3 mx-n1" v-if="post.business_hours">
                        <div class="col-4 px-1"><h6 class="mb-0">Open Hours</h6></div>
                        <div class="col-8 px-1"><h6 class="mb-0">{{post.business_hours}}</h6></div>
                    </div>
                    <div class="row mb-3 mx-n1" v-if="post.services && post.services.length">
                        <div class="col-12 px-1">
                            <div class="flex-wrap" style="flex-direction: row;">
                                <span class="service-item" v-for="(item, index) in post.services" :key="index">
                                    {{item}}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="fp-text-color-main" v-else>
                    <span class="ml-4">Not provided</span>
                </div>
            </div>
            <div v-else-if="post.category.name == 'Training/Lessons'">
                <div
                    v-if="
                        post.trainer_institute
                        || post.training_courses && post.training_courses.length
                        || (post.training_modes && post.training_modes.length)
                        || post.training_fee
                        || post.business_hours
                    "
                >
                    <div class="row mb-3 mx-n1" v-if="post.trainer_institute">
                        <div class="col-12 px-1"><span class="service-item mb-0 mt-n1">{{post.trainer_institute}}</span></div>
                    </div>
                    <div class="row mb-3 mx-n1" v-if="post.training_courses && post.training_courses.length">
                        <div class="col-12 px-1"><h6>Courses offered</h6></div>
                        <div class="col-12 px-1">
                            <span v-for="item in post.training_courses" :key="item" class="service-item">{{item}}</span>
                        </div>
                    </div>
                    <div class="row mb-3 mx-n1" v-if="post.training_modes">
                        <div class="col-12 px-1">
                            <span v-for="item in post.training_modes" :key="item" class="mr-3"><fa icon="check-square" class="fp-text-color-main" /> {{item}}</span>
                        </div>
                    </div>
                    <div class="row mb-3 mx-n1" v-if="post.training_fee">
                        <div class="col-12 px-1"><h6>Training or course Fee</h6></div>
                        <div class="col-12 px-1"><p class="info-description">{{post.training_fee}}</p></div>
                    </div>
                    <div class="row mb-3 mx-n1" v-if="post.business_hours">
                        <div class="col-12 px-1"><h6>Open Hours</h6></div>
                        <div class="col-12 px-1"><p class="info-description">{{post.business_hours}}</p></div>
                    </div>
                </div>
                <div class="fp-text-color-main" v-else>
                    <span class="ml-4">Not provided</span>
                </div>
            </div>
            <div v-else-if="post.category.name == 'Rent/Lease'">
                <div
                    v-if="
                        post.rent_lease_item
                        || post.rent_lease_cost
                        || post.rent_lease_term
                    "
                >
                    <div class="row mb-2 mx-n1" v-if="post.rent_lease_item">
                        <div class="col-12 px-1">
                            <span v-if="post.rent_lease_item" class="service-item">{{post.rent_lease_item}} {{post.rent_lease_unit}}</span>
                            <span v-if="post.rent_lease_cost && !isNaN(post.rent_lease_cost)" class="service-item">{{_currency(post.rent_lease_cost)}}/{{post.cost_unit}}</span>
                        </div>
                    </div>
                    <div class="row mb-3 mx-n1" v-if="post.rent_lease_term">
                        <div class="col-12 px-1">
                            <h6 class="mb-3">Term/ Duration</h6>
                            <p class="info-description">{{post.rent_lease_term}}</p>
                        </div>
                    </div>
                </div>
                <div class="fp-text-color-main" v-else>
                    <span class="ml-4">Not provided</span>
                </div>
            </div>
            <div v-else-if="post.category.name == 'Community'">
                <div class="row mb-3 mx-n1" v-if="post.business_hours">
                    <div class="col-12 px-1"><p class="mb-0" style="white-space: pre-line;">{{post.business_hours}}</p></div>
                </div>
                <div class="fp-text-color-main" v-else>
                    <span class="ml-4">Not provided</span>
                </div>
            </div>
            <div v-else-if="post.category.name == 'Pets' && post.sub_category && post.sub_category.name === 'Pet Adoption'">
                <div
                    v-if="
                        post.breed_species_type
                        || post.pet_age
                        || post.pet_color
                        || post.pet_sex
                        || post.pet_size_weight
                        || post.pet_characteristics
                        || post.business_hours
                    "
                >
                    <div class="row mb-3 mx-n1">
                        <div class="col-12 px-1">
                            <span v-if="post.breed_species_type" class="service-item">{{post.breed_species_type}}</span>
                            <span v-if="post.pet_age" class="service-item"><strong>Age:</strong> {{post.pet_age}}</span>
                            <span v-if="post.pet_color" class="service-item"><strong>Color:</strong> {{post.pet_color}}</span>
                            <span v-if="post.pet_sex" class="service-item"><strong>Sex:</strong> {{post.pet_sex}}</span>
                            <span v-if="post.pet_size_weight" class="service-item"><strong>Size/Weight:</strong> {{post.pet_size_weight}}</span>
                        </div>
                    </div>
                    <div class="row mb-3 mx-n1" v-if="post.pet_characteristics">
                        <div class="col-12 px-1"><h6 class="mb-2">Characteristics</h6></div>
                        <div class="col-12 px-1"><p class="info-description">{{post.pet_characteristics}}</p></div>
                    </div>
                    <div class="row mb-3 mx-n1" v-if="post.business_hours">
                        <div class="col-12 px-1"><h6 class="mb-2">Additional Info</h6></div>
                        <div class="col-12 px-1"><p class="info-description">{{post.business_hours}}</p></div>
                    </div>
                </div>
                <div class="fp-text-color-main" v-else>
                    <span class="ml-4">Not provided</span>
                </div>
            </div>
            <div v-else-if="post.category.name == 'Pets' && post.sub_category && post.sub_category.name === 'Pet Accessories'">
                <div
                    v-if="
                        post.job_title
                        || post.sale_by
                        || post.condition
                        || post.cost
                        || post.business_hours
                    "
                >
                    <div class="row mb-3 mx-n1">
                        <div class="col-12 px-1">
                            <span v-if="post.job_title" class="service-item">{{post.job_title}}</span>
                            <span v-if="post.sale_by" class="service-item"><strong>Sale by:</strong> {{post.sale_by}}</span>
                            <span v-if="post.condition" class="service-item"><strong>Condition:</strong> {{post.condition}}</span>
                            <span v-if="post.cost" class="service-item"><strong>Price:</strong> {{post.cost}}</span>
                        </div>
                    </div>
                    <div class="row mb-3 mx-n1" v-if="post.business_hours">
                        <div class="col-12 px-1"><h6 class="mb-2">Additional Info</h6></div>
                        <div class="col-12 px-1"><p class="info-description">{{post.business_hours}}</p></div>
                    </div>
                </div>
                <div class="fp-text-color-main" v-else>
                    <span class="ml-4">Not provided</span>
                </div>
            </div>

            <div v-else>
                <div
                    v-if="post.service_provider
                        || post.license
                        || post.business_hours
                        || post.services && post.services.length
                    "
                >
                    <div class="row mb-3 mx-n1" v-if="post.service_provider">
                        <div class="col-4 px-1">
                            <h6 v-if="post.category.name === 'Gigs/Freelancers'" class="mb-0">Freelancer</h6>
                            <h6 class="mb-0">{{post.category.name == 'Pets' && post.sub_category.name == 'Pet Care' ? 'Care provider' : 'Services by'}}</h6>
                        </div>
                        <div class="col-8 px-1"><h6 class="mb-0">{{post.service_provider}}</h6></div>
                    </div>
                    <div class="row mb-3 mx-n1" v-if="post.business_hours">
                        <div class="col-4 px-1"><h6 class="mb-0">{{ post.category.name === 'Gigs/Freelancers' ? 'Working Hours' : 'Open Hours'}}</h6></div>
                        <div class="col-8 px-1"><p class="mb-0">{{post.business_hours}}</p></div>
                    </div>
                    <div class="row mb-3 mx-n1" v-if="post.license">
                        <div class="col-4 px-1"><h6 class="mb-0">License #</h6></div>
                        <div class="col-8 px-1"><p class="mb-0">{{post.license}}</p></div>
                    </div>
                    <div class="row mb-3 mx-n1" v-if="post.services && post.services.length">
                        <div class="col-12 px-1">
                            <div class="flex-wrap" style="flex-direction: row;">
                                <span class="service-item" v-for="(item, index) in post.services" :key="index">
                                    {{item}}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="fp-text-color-main" v-else>
                    <span class="ml-4">Not provided</span>
                </div>
            </div>
        </template>
        <div v-else-if="post.automotive_item_name">
            <div v-for="group in automotive_post_fields[post.automotive_category.name]"
                :key="group.group_name"
                class="fields-group"
            >
                <div v-if="group.type === 'array'">
                    <h6 v-if="post[group.field].length" class="group-title fp-text-color">{{ group.group_name }}</h6>
                    <div v-if="post[group.field].length" class="service-item-container fp-border-color-1">
                        <span v-for="(value, index) in post[group.field]"
                             :key="index"
                             class="service-item"
                        >{{value}}</span>
                    </div>
                </div>
                <div v-else :class="visibleGroup(group) === false && 'd-none'">
                    <h6 v-if="group.group_name" class="group-title fp-text-color">{{ group.group_name }}</h6>
                    <div class="service-item-container fp-border-color-1" :class="!group.group_name && 'no-group'">
                        <span v-for="field in group.fields" :key="field.field"
                            class="service-item"
                            :class="!post[field.field] && 'd-none'"
                        >
                            <strong>{{ field.label }}: </strong>
                            <span v-if="field.type === 'currency'">{{_currency(post[field.field])}}</span>
                            <span v-else>{{ post[field.field] }}</span>
                        </span>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
export default {
    name: 'QuickInformation',
    props: ['post'],
    data() {
        return {
            automotive_post_fields: {
                'ATV/UTV': [
                    {
                        group_name: 'Basic Details',
                        fields: [
                            { field: 'automotive_item_name', label: 'For Sale' },
                            { field: 'automotive_make_manufacturer', label: 'Make' },
                            { field: 'automotive_model', label: 'Model' },
                            { field: 'automotive_year', label: 'Year' },
                            { field: 'automotive_color', label: 'Color' },
                            { field: 'condition', label: 'Condition' },
                            { field: 'automotive_class', label: 'Category' },
                            { field: 'cost', label: 'Asking Price', type: 'currency', },
                        ],
                    },
                    {
                        group_name: 'Specific Details',
                        fields: [
                            { field: 'automotive_vin', label: 'VIN #' },
                            { field: 'automotive_odometer', label: 'Odometer' },
                            { field: 'automotive_engine', label: 'Engine Power' },
                            { field: 'automotive_fuel_type', label: 'Fuel Type' },
                            { field: 'automotive_dimensions', label: 'Dimensions' },
                            { field: 'automotive_wheel_size', label: 'Wheel Size' },
                            { field: 'automotive_overall_weight', label: 'Overall Weight' },
                        ],
                    },
                    {
                        group_name: 'Features',
                        type: 'array',
                        field: 'automotive_features',
                    }
                ],
                '2-Wheels/Bicycles': [
                    {
                        group_name: 'Basic Details',
                        fields: [
                            { field: 'automotive_item_name', label: 'For Sale' },
                            { field: 'automotive_make_manufacturer', label: 'Make' },
                            { field: 'automotive_model', label: 'Model/Serial Number' },
                            { field: 'automotive_year', label: 'Year' },
                            { field: 'automotive_color', label: 'Color' },
                            { field: 'condition', label: 'Condition' },
                            { field: 'automotive_class', label: 'Bicycle Type' },
                            { field: 'cost', label: 'Asking Price', type: 'currency', },
                        ],
                    },
                    {
                        group_name: 'Specific Details',
                        fields: [
                            { field: 'automotive_vin', label: 'Frame Size' },
                            { field: 'automotive_wheel_size', label: 'Wheel Size' },
                            { field: 'automotive_engine', label: 'Frame Material' },
                            { field: 'automotive_fuel_type', label: 'Brake Type' },
                            { field: 'automotive_assist', label: 'Assist' },
                            { field: 'automotive_dimensions', label: 'Suspension' },
                            { field: 'automotive_overall_weight', label: 'Handle Bar' },
                        ],
                    },
                    {
                        group_name: 'Features',
                        type: 'array',
                        field: 'automotive_features',
                    }
                ],
                'Boats/Streamers': [
                    {
                        group_name: 'Basic Details',
                        fields: [
                            { field: 'automotive_item_name', label: 'For Sale' },
                            { field: 'automotive_vin', label: 'VIN #' },
                            { field: 'automotive_make_manufacturer', label: 'Make' },
                            { field: 'automotive_model', label: 'Model/Serial Number' },
                            { field: 'automotive_year', label: 'Year' },
                            { field: 'condition', label: 'Condition' },
                            { field: 'automotive_class', label: 'Class' },
                            { field: 'cost', label: 'Asking Price', type: 'currency', },
                        ],
                    },
                    {
                        group_name: 'Measurements',
                        fields: [
                            { field: 'business_hours', label: 'Engine Hours' },
                            { field: 'automotive_odometer', label: 'LOA/LWL' },
                            { field: 'automotive_speed', label: 'Cruising Speed' },
                            { field: 'automotive_dimensions', label: 'Dry Weight' },
                            { field: 'automotive_fuel_tank', label: 'Fuel Tank' },
                            { field: 'automotive_wheel_size', label: 'Water Tank' },
                        ],
                    },
                    {
                        group_name: 'Propulsion',
                        fields: [
                            { field: 'automotive_engine_make', label: 'Engine Make' },
                            { field: 'automotive_engine', label: 'Engine Model' },
                            { field: 'automotive_make_year', label: 'Make Year' },
                            { field: 'automotive_total_power', label: 'Total Power' },
                            { field: 'automotive_engine_type', label: 'Engine Type' },
                            { field: 'automotive_drive_type', label: 'Drive Type' },
                            { field: 'automotive_fuel_type', label: 'Fuel Type' },
                            { field: 'automotive_propeller_type', label: 'Propeller Type' },
                        ],
                    },
                    {
                        group_name: 'Features',
                        type: 'array',
                        field: 'automotive_features',
                    }
                ],
                'Cars/Trucks/SUV': [
                    {
                        group_name: 'Basic Details',
                        fields: [
                            { field: 'automotive_item_name', label: 'For Sale' },
                            { field: 'automotive_make_manufacturer', label: 'Make' },
                            { field: 'automotive_model', label: 'Model/Serial Number' },
                            { field: 'automotive_year', label: 'Year' },
                            { field: 'automotive_color', label: 'Color' },
                            { field: 'condition', label: 'Condition' },
                            { field: 'automotive_class', label: 'No.of Owners' },
                            { field: 'cost', label: 'Asking Price', type: 'currency', },
                        ],
                    },
                    {
                        group_name: 'Specific Details',
                        fields: [
                            { field: 'automotive_vin', label: 'VIN #' },
                            { field: 'automotive_title', label: 'Title' },
                            { field: 'automotive_odometer', label: 'Odometer' },
                            { field: 'automotive_transmission', label: 'Transmission' },
                            { field: 'automotive_mpg', label: 'MPG' },
                            { field: 'automotive_fuel_type', label: 'Fuel Type' },
                            { field: 'automotive_engine', label: 'Engine' },
                        ],
                    },
                    {
                        group_name: 'Features',
                        type: 'array',
                        field: 'automotive_features',
                    }
                ],
                'Motorbikes/Scooters': [
                    {
                        group_name: 'Basic Details',
                        fields: [
                            { field: 'automotive_item_name', label: 'For Sale' },
                            { field: 'automotive_make_manufacturer', label: 'Make' },
                            { field: 'automotive_model', label: 'Model/Serial Number' },
                            { field: 'automotive_year', label: 'Year' },
                            { field: 'automotive_color', label: 'Color' },
                            { field: 'condition', label: 'Condition' },
                            { field: 'automotive_class', label: 'Bike Type' },
                            { field: 'cost', label: 'Asking Price', type: 'currency', },
                        ],
                    },
                    {
                        group_name: 'Specific Details',
                        fields: [
                            { field: 'automotive_vin', label: 'VIN #' },
                            { field: 'automotive_title', label: 'Title' },
                            { field: 'automotive_odometer', label: 'Odometer' },
                            { field: 'automotive_transmission', label: 'Transmission' },
                            { field: 'automotive_mpg', label: 'MPG' },
                            { field: 'automotive_fuel_type', label: 'Fuel Type' },
                            { field: 'automotive_engine', label: 'Engine' },
                        ],
                    },
                    {
                        group_name: 'Features',
                        type: 'array',
                        field: 'automotive_features',
                    }
                ],
                'RV/Campers/Trailers': [
                    {
                        group_name: 'Basic Details',
                        fields: [
                            { field: 'automotive_item_name', label: 'For Sale' },
                            { field: 'automotive_make_manufacturer', label: 'Make' },
                            { field: 'automotive_model', label: 'Model/Serial Number' },
                            { field: 'automotive_year', label: 'Year' },
                            { field: 'automotive_color', label: 'Color' },
                            { field: 'condition', label: 'Condition' },
                            { field: 'automotive_class', label: 'Class' },
                            { field: 'cost', label: 'Asking Price', type: 'currency', },
                        ],
                    },
                    {
                        group_name: 'Specific Details',
                        fields: [
                            { field: 'automotive_vin', label: 'VIN #' },
                            { field: 'automotive_title', label: 'Gross Weight' },
                            { field: 'automotive_overall_weight', label: 'Sleeping Capacity' },
                            { field: 'automotive_odometer', label: 'Air Condition' },
                            { field: 'automotive_dimensions', label: 'Total Length' },
                            { field: 'automotive_mpg', label: 'Self Contained' },
                            { field: 'automotive_fuel_type', label: 'Floor Plan' },
                            { field: 'automotive_assist', label: 'Awnings' },
                            { field: 'automotive_engine', label: 'Generator' },
                        ],
                    },
                    {
                        group_name: 'Features',
                        type: 'array',
                        field: 'automotive_features',
                    }
                ],
                'Electric Vehicles/Inventions': [
                    {
                        fields: [
                            { field: 'automotive_item_name', label: 'For Sale' },
                            { field: 'sale_by', label: 'Sale by' },
                            { field: 'automotive_make_manufacturer', label: 'Make' },
                            { field: 'automotive_model', label: 'Model/Serial Number' },
                            { field: 'condition', label: 'Condition' },
                            { field: 'cost', label: 'Asking Price', type: 'currency', },
                            { field: 'business_hours', label: 'Additional Info' },
                        ],
                    }
                ],
                'New/Used Parts': [
                    {
                        fields: [
                            { field: 'automotive_item_name', label: 'For Sale' },
                            { field: 'sale_by', label: 'Sale by' },
                            { field: 'condition', label: 'Condition' },
                            { field: 'cost', label: 'Asking Price', type: 'currency', },
                            { field: 'automotive_make_manufacturer', label: 'Make' },
                            { field: 'automotive_model', label: 'Model/Serial Number' },
                            { field: 'business_hours', label: 'Additional Info' },
                        ],
                    }
                ]
            },
        }
    },
    methods: {
        _currency(amount) {
            return Number(amount).toLocaleString('en-US', {
                style: 'currency',
                currency: 'USD',
            });
        },
        visibleGroup(group) {
            for (let index = 0; index < group.fields.length; index++) {
                const field = group.fields[index];
                if (!!this.post[field.field]) return true;
            }
            return false;
        }
    }
}
</script>

<style lang="scss" scoped>
    h6, p {
        color: #64748B;
        font-size: 0.9rem;
        overflow: hidden;
        text-overflow: ellipsis;
    }
    .information-item {
        display: inline-block;
        border: solid 1px #004080;
        color: #007BFF;
        padding: 4px 4px 2px;
        margin-right: 5px;
        margin-bottom: 5px;
        font-size: 14.4px;
        font-weight: 500;
    }
    .service-item {
        display: inline-block;
        background: linear-gradient(100.05deg, #FF22A1 2.3%, #FFA3D8 100%);
        color: #FFF;
        padding: 4px 10px 2px;
        margin-right: 5px;
        margin-bottom: 10px;
        font-size: 14px;
        font-weight: 400;
        border-radius: 4px;
        max-width: calc(100% - 8px);
    }

    .info-description {
        margin-bottom: 0;
        padding: 8px;
        color: #64748B;
        border: solid 1px #D3DDEB;
        border-radius: 6px;
        font-size: 14px;
        font-weight: 400;
    }
    [data-theme=dark] {
        .info-description {
            color: #8598B2;
            border: solid 1px #33455780;
        }
    }

    .fields-group {
        margin-bottom: 16px;
        .group-title {
            font-size: 16px;
        }
        .service-item-container {
            padding: 8px 0 0 8px;
            border-radius: 8px;
            border-width: 1px;
            border-style: solid;
            &.no-group {
                border: none;
                padding: 0;
            }
        }
    }
</style>