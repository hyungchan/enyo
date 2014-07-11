(function (enyo, scope) {
	
	/**
	* A mixin designed to abstract interaction of the {@link enyo.Object#get} and
	* {@link enyo.Object#set} methods. It does not need to be applied to a
	* [subkind]{@link external:subkind} of {@link enyo.Object}.
	* 
	* @mixin enyo.ProxyObject
	* @public
	*/
	enyo.ProxyObject = {
		
		/**
		* @private
		*/
		name: 'ProxyObject',
		
		/**
		* The property designated as the object from which to proxy actions.
		* 
		* @type {String}
		* @default 'data'
		* @public
		*/
		proxyObjectKey: 'data',
		
		/**
		* The overloaded [getter]{@link enyo.Object#get}. Acccepts the same parameters and
		* attempts to call the same method on the [proxy]{@link enyo.ProxyObject.proxyObjectKey}.
		* If it cannot find a [proxy]{@link enyo.ProxyObject.proxyObjectKey} it will return
		* `undefined`. {@see enyo.Object#get} and {@see enyo.getPath}.
		* 
		* @param {String} path The path from which to retrieve a value.
		* @returns {this} The value for the given path or `undefined` if the path could not be
		* 	completely resolved.
		* @method
		* @public
		*/
		get: function (path) {
			var key = this.proxyObjectKey,
				proxy = this[key];
			
			if (proxy) {
				if (proxy.get) return proxy.get.apply(proxy, arguments);
				else return enyo.getPath.call(proxy, path);
			}
			
			return undefined;
		},
		
		/**
		* The overloaded [setter]{@link enyo.Object#set}. Accepts the same parameters and
		* attempts to call the same method on the [proxy]{@link enyo.ProxyObject~proxyObjectKey}.
		* If it cannot find the proxy it returns the callee for chaining.
		* 
		* @param {String} path The path for which to set the given value.
		* @param {*} is The value to set.
		* @param {Object} [opts] An options hash.
		* @returns {this} The callee for chaining.
		* @method
		* @public
		*/
		set: function (path, is, opts) {
			var key = this.proxyObjectKey,
				proxy = this[key],
				was,
				force;
			
			force = typeof opts == 'object' ? opts.force : opts;
			
			if (proxy) {
				was = this.get(path);
				if (proxy.set) proxy.set.apply(proxy, arguments);
				else enyo.setPath.apply(proxy, arguments);
				
				if (this.notify && (
					force ||
					was !== is ||
					(opts && opts.compare && opts.compare(was, is))
				)) this.notify(path, was, is);
			}
			
			return this;
		}
	};
	
})(enyo, this);