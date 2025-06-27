import axios from "axios";
import * as helper from "../services/serviceHelpers";

const blogsService = {
  endpoint: `${helper.API_HOST_PREFIX}/api/blogs`,
};

blogsService.add = (payload) => {
  const config = {
    method: "POST",
    url: blogsService.endpoint,
    data: payload,
    crossdomain: true,
    headers: { "Content-Type": "application/json" },
  };
  return axios(config).then(helper.onGlobalSuccess).catch(helper.onGlobalError);
};

blogsService.delete = (id) => {
  const config = {
    method: "PUT",
    url: blogsService.endpoint + `/delete/${id}`,
    crossdomain: true,
    headers: { "Content-Type": "application/json" },
  };
  return axios(config).then(helper.onGlobalSuccess).catch(helper.onGlobalError);
};

blogsService.getAll = (pageIndex, pageSize) => {
  const config = {
    method: "GET",
    url: blogsService.endpoint + `/paginate/?pageIndex=${pageIndex}&pageSize=${pageSize}`,
    crossdomain: true,
    headers: { "Content-Type": "application/json" },
  };
  return axios(config).then(helper.onGlobalSuccess).catch(helper.onGlobalError);
};

blogsService.getById = (id) => {
  const config = {
    method: "GET",
    url: blogsService.endpoint + `/${id}`,
    crossdomain: true,
    headers: { "Content-Type": "application/json" },
  };
  return axios(config).then(helper.onGlobalSuccess).catch(helper.onGlobalError);
};

blogsService.getByBlogTypeId = (pageIndex, pageSize, blogTypeId) => {
  const config = {
    method: "GET",
    url: blogsService.endpoint + `/bytypeid/?pageIndex=${pageIndex}&pageSize=${pageSize}&blogTypeId=${blogTypeId}`,
    crossdomain: true,
    headers: { "Content-Type": "application/json" },
  };
  return axios(config).then(helper.onGlobalSuccess).catch(helper.onGlobalError);
};

blogsService.getByCreatedBy = (pageIndex, pageSize, query) => {
  const config = {
    method: "GET",
    url: blogsService.endpoint + `/byauthor/?pageIndex=${pageIndex}&pageSize=${pageSize}&query=${query}`,
    crossdomain: true,
    headers: { "Content-Type": "application/json" },
  };
  return axios(config).then(helper.onGlobalSuccess).catch(helper.onGlobalError);
};

blogsService.search = (pageIndex, pageSize, query) => {
  const config = {
    method: "GET",
    url: blogsService.endpoint + `/search?pageIndex=${pageIndex}&pageSize=${pageSize}&query=${query}`,
    crossdomain: true,
    headers: { "Content-Type": "application/json" },
  };
  return axios(config).then(helper.onGlobalSuccess).catch(helper.onGlobalError);
};

blogsService.update = (id) => {
  const config = {
    method: "PUT",
    url: blogsService.endpoint + `/${id}`,
    crossdomain: true,
    headers: { "Content-Type": "application/json" },
  };
  return axios(config).then(helper.onGlobalSuccess).catch(helper.onGlobalError);
};

export default blogsService;