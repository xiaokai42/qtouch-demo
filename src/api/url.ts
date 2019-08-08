import baseAPI from "@/api/modules/base";
import adminAPI from "@/api/modules/admin";
import organizationAPI from "@/api/modules/organization";
import typeDetailAPI from "@/api/modules/typeDetail";
import personAPI from "@/api/modules/person";
import authAPI from "@/api/modules/auth";
import userMenuAPI from "@/api/modules/userMenu";
import userInfoAPI from '@/api/modules/userInfo';
import test from '@/api/modules/test';

const URL = {
  base: {
    ...baseAPI
  },
  admin: {
    ...adminAPI
  },
  organizaition: {
    ...organizationAPI
  },
  typeDetail: {
    ...typeDetailAPI
  },
  person: {
    ...personAPI
  },
  auth: {
    ...authAPI
  },
  userMenu: {
    ...userMenuAPI
  },
  personInfo: {
    ...userInfoAPI
  },
  test: {
    ...test
  }
};

export default URL;
