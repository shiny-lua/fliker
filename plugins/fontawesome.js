import Vue from 'vue'
import { library, config } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

import {
  faUser, faLock, faSignOutAlt, faCog, faBars, faChevronRight, faChevronUp, faChevronDown, faEnvelope, faPaperPlane, faSearch, faEnvelopeSquare, faMapMarkerAlt, faUnlockAlt, faSignInAlt, faThLarge, faAlignJustify, faList, faPlus, faMinus, faCheckCircle, faTimesCircle, faTimes, faPhoneAlt, faHome, faThumbsUp, faComments, faMinusCircle, faArchive, faCheckSquare, faImage, faPlusCircle, faEllipsisH, faPencilAlt, faUserTie, faLaptop, faArrowLeft, faShare, faReply, faThumbsDown, faAngleDoubleLeft, faAngleDoubleRight, faCircle, faCalendarAlt, faGlobeAmericas, faUserFriends, faHeart, faComment, faVideo, faCheck, faBan, faChevronCircleLeft, faChevronCircleRight, faStar, faCaretDown, faBook, faArrowUp, faGlobe, faEye, faEyeSlash, faCarAlt, faChevronLeft, faQuestionCircle, faExclamation, faBell, faCommentDots, faUserGraduate, faSchool, faBriefcase, faBuilding, faCommentSlash, faCamera, faUserPlus, faHistory, faStepForward, faStepBackward, faUserMinus, faArrowDown, faUpload, faArrowAltCircleUp, faArrowAltCircleDown, faUsers, faShareAlt,
} from '@fortawesome/free-solid-svg-icons'

import {
  faHeart as farHeart,
  faTimesCircle as farTimesCircle,
  faEdit as farEdit,
  faSave as farSave,
  faEnvelope as farEnvelope,
  faCommentDots as farCommentDots,
  faBell as farBell,
  faWindowRestore as farWindowRestore,
  faTrashAlt as farTrashAlt,
  faNewspaper as farNewspaper,
  faQuestionCircle as farQuestionCircle,
  faFileAlt as farFileAlt,
  faPlayCircle as farPlayCircle,
  faPauseCircle as farPauseCircle,
  faPlusSquare as farPlusSquare,
  faEye as farEye,
  faCaretSquareUp as farCaretSquareUp,
} from '@fortawesome/free-regular-svg-icons'

import {
  faGooglePlusG, faFacebookF, faLinkedinIn, faTwitter, faYoutube,
} from '@fortawesome/free-brands-svg-icons'
import { faExclamationCircle, faGraduationCap, faPlay } from '../node_modules/@fortawesome/free-solid-svg-icons/index'

config.autoAddCss = false

library.add(
  faUser,
  faLock,
  faSignOutAlt,
  faCog,
  faBell,
  faBars,
  faChevronRight,
  faChevronUp,
  faChevronDown,
  faEnvelope,
  faPaperPlane,
  faSearch,
  faEnvelopeSquare,
  faMapMarkerAlt,
  faUnlockAlt,
  faSignInAlt,
  faThLarge,
  faAlignJustify,
  faList,
  faPlus,
  faMinus,
  faCheckCircle,
  faTimesCircle,
  faTimes,
  faPhoneAlt,
  faHome,
  faThumbsUp,
  faComments,
  faMinusCircle,
  faArchive,
  faCheckSquare,
  faImage,
  faPlusCircle,
  faEllipsisH,
  faPencilAlt,
  faUserTie,
  faLaptop,
  faArrowLeft,
  faShare,
  faReply,
  faThumbsDown,
  faAngleDoubleLeft,
  faAngleDoubleRight,
  faCircle,
  faCalendarAlt,
  faGlobeAmericas,
  faUserFriends,
  faHeart,
  faVideo,
  faCheck, faBan, faChevronCircleLeft,
  faChevronCircleRight, faStar, faCaretDown, faBook, faArrowUp, faGlobe,
  faEye, faEyeSlash, faCarAlt,
  faChevronLeft,
  faQuestionCircle, faExclamation,
  faUserGraduate, faSchool,
  faBriefcase, faBuilding, faCommentSlash, faHeart,
  faCamera, faUserPlus, faHistory, faStepForward, faStepBackward, faUserMinus, faArrowDown,
  faUpload, faArrowAltCircleUp, faArrowAltCircleDown, faUsers, faShareAlt, faExclamationCircle, faPlay, faGraduationCap,

  faGooglePlusG, faFacebookF, faLinkedinIn, faTwitter, faYoutube,
  farHeart, farEnvelope, farTimesCircle, farWindowRestore, farTrashAlt, farNewspaper, farSave, farQuestionCircle, farBell, farFileAlt, farPlayCircle, farPauseCircle, farEdit, farEye, farCaretSquareUp
)

Vue.component('Fa', FontAwesomeIcon)
