# 1. Intuition: The Physics of Movement

Imagine you are standing at the origin $(0,0)$. A **vector** is simply an instruction to move: "Walk 2 steps East, 1 step North".

In physics, this could be a force pushing an object. In computer graphics, it's the position of a pixel relative to another. The arrow shows us the **Magnitude** (how far) and **Direction** (which way).

# 2. Definition: The Mathematical Object

Formally, a vector $\mathbf{v}$ in an $n$-dimensional space $\mathbb{R}^n$ is an ordered list of $n$ real numbers.

$$ \mathbf{v} = \begin{bmatrix} x \\ y \end{bmatrix} $$

The **Magnitude** (or norm) is denoted as $||\mathbf{v}||$ and calculated using the Pythagorean theorem:

$$ ||\mathbf{v}|| = \sqrt{x^2 + y^2} $$

# 3. Interactive: Vector Addition

When we add two vectors $\mathbf{a}$ and $\mathbf{b}$, we perform component-wise addition:

$$ \mathbf{a} + \mathbf{b} = \begin{bmatrix} a_x + b_x \\ a_y + b_y \end{bmatrix} $$

Geometrically, this means placing the tail of $\mathbf{b}$ at the head of $\mathbf{a}$. The result is the path from the start to the finish.

# 4. Application: Recommender Systems

In Machine Learning, we treat data as vectors. For example, a user can be a vector of their preferences: $\mathbf{u} = [\text{Age}, \text{Income}]$.

The **Dot Product** helps us measure similarity. If $\mathbf{u} \cdot \mathbf{v}$ is high, the vectors point in the same direction, meaning the user and the item are a "good match".

# 5. Check Your Understanding

You've learned about Vector Addition and Dot Products. Let's see if you've mastered the concepts.
