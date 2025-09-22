// Замени на свой, чтобы получить независимый от других набор данных.
// "боевая" версия инстапро лежит в ключе prod
const personalKey = "sergei-smirnov";
const baseHost = "https://webdev-api.sky.pro";
const postsHost = `${baseHost}/api/v1/${personalKey}/instapro`;

export function getPosts({ token }) {
  return fetch(postsHost, {
    method: "GET",
    headers: {
      Authorization: token,
    },
  })
    .then((response) => {
      if (response.status === 401) {
        throw new Error("Нет авторизации");
      }

      return response.json();
    })
    .then((data) => {
      return data.posts;
    });
}

export function registerUser({ login, password, name, imageUrl }) {
  return fetch(baseHost + "/api/user", {
    method: "POST",
    body: JSON.stringify({
      login,
      password,
      name,
      imageUrl,
    }),
  }).then((response) => {
    if (response.status === 400) {
      throw new Error("Такой пользователь уже существует");
    }
    return response.json();
  });
}

export function loginUser({ login, password }) {
  return fetch(baseHost + "/api/user/login", {
    method: "POST",
    body: JSON.stringify({
      login,
      password,
    }),
  }).then((response) => {
    if (response.status === 400) {
      throw new Error("Неверный логин или пароль");
    }
    return response.json();
  });
}

// Загружает картинку в облако, возвращает url загруженной картинки
export function uploadImage({ file }) {
  const data = new FormData();
  data.append("file", file);

  return fetch(baseHost + "/api/upload/image", {
    method: "POST",
    body: data,
  }).then((response) => {
    return response.json();
  });
}

export function getUserPosts({ userId, token }) {
  return fetch(`${postsHost}/user-posts/${userId}`, {
    method: "GET",
    headers: {
      Authorization: token,
    },
  })
    .then((response) => {
      if (response.status === 401) {
        throw new Error("Нет авторизации");
      }
      return response.json();
    })
    .then((data) => data.posts);
}

export function addPost({ description, imageUrl, token }) {
  // Проверка на пустые значения
  if (!description || !imageUrl) {
    return Promise.reject(new Error("Описание и изображение обязательны"));
  }
  // Для отладки: вывести токен
  console.log("addPost token:", token);

  return fetch(postsHost, {
    method: "POST",
    headers: {
      Authorization: token,
      // "Content-Type": "application/json",
    },
    body: JSON.stringify({ description, imageUrl }),
  }).then((response) => {
    if (response.status === 400) {
      // Для отладки: вывести, что именно отправляется
      console.warn("Ошибка 400 при добавлении поста", {
        description,
        imageUrl,
        token,
      });
      throw new Error(
        "Ошибка добавления поста. Проверьте, что описание и изображение не пустые, и вы авторизованы."
      );
    }
    return response.json();
  });
}

export function likePost({ postId, token }) {
  return fetch(`${postsHost}/${postId}/like`, {
    method: "POST",
    headers: { Authorization: token },
  }).then((response) => response.json());
}

export function dislikePost({ postId, token }) {
  return fetch(`${postsHost}/${postId}/dislike`, {
    method: "POST",
    headers: { Authorization: token },
  }).then((response) => response.json());
}
