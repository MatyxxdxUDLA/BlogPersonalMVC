<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';

interface Post {
  _id: string;
  title: string;
  content: string;
  createdAt?: string;
  updatedAt?: string;
}

const router = useRouter();
const posts = ref<Post[]>([]);
const newPost = ref<Omit<Post, '_id'>>({ title: '', content: '' });
const editingPost = ref<string | null>(null);
const message = ref<string>('');
const token = localStorage.getItem('token') as string;

const fetchPosts = async (): Promise<void> => {
  try {
    const response = await fetch('http://localhost:3000/api/posts', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    const data = await response.json();
    if (data.success) {
      posts.value = data.posts as Post[];
    }
  } catch (error) {
    message.value = 'Error fetching posts';
  }
};

const createPost = async (): Promise<void> => {
  try {
    const response = await fetch('http://localhost:3000/api/posts', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(newPost.value)
    });
    const data = await response.json();
    if (data.success) {
      posts.value.unshift(data.post as Post);
      newPost.value = { title: '', content: '' };
      message.value = 'Post created successfully';
    }
  } catch (error) {
    message.value = 'Error creating post';
  }
};

const updatePost = async (post: Post): Promise<void> => {
  try {
    const response = await fetch(`http://localhost:3000/api/posts/${post._id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(post)
    });
    const data = await response.json();
    if (data.success) {
      const index = posts.value.findIndex((p: Post) => p._id === post._id);
      posts.value[index] = data.post as Post;
      editingPost.value = null;
      message.value = 'Post updated successfully';
    }
  } catch (error) {
    message.value = 'Error updating post';
  }
};

const deletePost = async (postId: string): Promise<void> => {
  try {
    const response = await fetch(`http://localhost:3000/api/posts/${postId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    const data = await response.json();
    if (data.success) {
      posts.value = posts.value.filter((p: Post) => p._id !== postId);
      message.value = 'Post deleted successfully';
    }
  } catch (error) {
    message.value = 'Error deleting post';
  }
};

const logout = (): void => {
  localStorage.removeItem('token');
  localStorage.removeItem('userId');
  router.push('/');
};

onMounted((): void => {
  if (!token) router.push('/login');
  fetchPosts();
});
</script>

<template>
  <div class="dashboard">
    <div class="header">
      <h1>My Blog Dashboard</h1>
      <button @click="logout" class="logout-btn">Logout</button>
    </div>

    <div class="new-post">
      <h2>Create New Post</h2>
      <form @submit.prevent="createPost">
        <input
          v-model="newPost.title"
          placeholder="Title"
          required
        />
        <textarea
          v-model="newPost.content"
          placeholder="Content"
          required
        ></textarea>
        <button type="submit">Create Post</button>
      </form>
    </div>

    <div v-if="message" class="message" :class="{ error: message.includes('Error') }">
      {{ message }}
    </div>

    <div class="posts">
      <h2>My Posts</h2>
      <div v-for="post in posts" :key="post._id" class="post">
        <template v-if="editingPost === post._id">
          <input v-model="post.title" />
          <textarea v-model="post.content"></textarea>
          <div class="actions">
            <button @click="updatePost(post)">Save</button>
            <button @click="editingPost = null">Cancel</button>
          </div>
        </template>
        <template v-else>
          <h3>{{ post.title }}</h3>
          <p>{{ post.content }}</p>
          <div class="actions">
            <button @click="editingPost = post._id">Edit</button>
            <button @click="deletePost(post._id)" class="delete">Delete</button>
          </div>
        </template>
      </div>
    </div>
  </div>
</template>

<style scoped>
.dashboard {
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
}

.logout-btn {
  background-color: #dc3545;
}

.new-post {
  margin-bottom: 2rem;
  padding: 1rem;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.new-post form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

input, textarea {
  width: 100%;
  padding: 0.5rem;
  border: 1px solid #ddd;
  border-radius: 4px;
}

textarea {
  min-height: 100px;
  resize: vertical;
}

.post {
  background: #fff;
  padding: 1rem;
  margin-bottom: 1rem;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.actions {
  display: flex;
  gap: 0.5rem;
  margin-top: 1rem;
}

.delete {
  background-color: #dc3545;
}

.message {
  padding: 1rem;
  margin: 1rem 0;
  border-radius: 4px;
  background-color: #d4edda;
  color: #155724;
}

.message.error {
  background-color: #f8d7da;
  color: #721c24;
}
</style>